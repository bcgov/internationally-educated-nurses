import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  In,
  Not,
  IsNull,
  Repository,
  getManager,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { EmailDomains, ValidRoles } from '@ien/common';
import { EmployeeEntity } from './entity/employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeUser } from 'src/common/interface/EmployeeUser';

export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(IENUsers)
    private ienUsersRepository: Repository<IENUsers>,
  ) {}

  async resolveUser(keycloakId: string, userData: Partial<EmployeeEntity>): Promise<EmployeeUser> {
    const existingEmployee = await this.getUserByKeycloakId(keycloakId);
    if (existingEmployee) {
      const org = this._setOrganization(existingEmployee.email);

      if (org) {
        await this.employeeRepository.update(existingEmployee.id, { organization: org });
      }
      if (existingEmployee.email && !existingEmployee.user_id) {
        // It will add missing entry in user's table
        const tempUser = await this.getUserId(existingEmployee);
        if (tempUser) {
          existingEmployee.user_id = tempUser.id;
        }
      }
      return existingEmployee;
    }

    userData.organization = this._setOrganization(userData.email);
    const newEmployee = this.employeeRepository.create(userData);
    const employee = await this.employeeRepository.save(newEmployee);
    const user = await this.getUserId(userData); // It will add new user record if not exist.
    const empUser: EmployeeUser = {
      ...employee,
      user_id: user ? user.id : null,
    };
    return empUser;
  }

  _setOrganization(email?: string): string | undefined {
    if (!email) {
      return undefined;
    }
    // get domain from email string
    const domain = email.substring(email.lastIndexOf('@') + 1);

    //return organization or undefined
    return EmailDomains[domain as keyof typeof EmailDomains];
  }

  async getUserByKeycloakId(keycloakId: string): Promise<EmployeeUser | undefined> {
    return getManager()
      .createQueryBuilder(EmployeeEntity, 'employee')
      .select('employee.*')
      .addSelect('users.id', 'user_id')
      .leftJoin('ien_users', 'users', 'employee.email = users.email')
      .where('employee.keycloak_id = :keyclock', { keyclock: keycloakId }) // WHERE t3.event = 2019
      .getRawOne();
  }

  async getUserId(userData: Partial<EmployeeEntity>): Promise<IENUsers | undefined> {
    await this._upsertUser(userData);
    return this.ienUsersRepository.findOne({ email: userData.email });
  }

  async _upsertUser(userData: Partial<EmployeeEntity>): Promise<void> {
    if (userData.email) {
      await this.ienUsersRepository.upsert(
        {
          email: userData.email,
          name: userData.name,
        },
        ['email'],
      );
    }
  }

  _nameSearchQuery(keyword: string) {
    let keywords = keyword.split(' ');
    keywords = keywords.filter(item => item.length);
    if (keywords.length > 0) {
      const tempConditions: string[] = [];
      keywords.forEach(ele => {
        tempConditions.push(`EmployeeEntity.name ilike '%${ele}%'`);
      });
      return tempConditions.join(' AND ');
    }
    return `EmployeeEntity.name ilike '%${keyword}%'`;
  }

  /**
   * List and filter employees,
   * Only for administrator purposes
   * We will build UI for this when we extend our scope to provide user-management
   * @param name optional name wise filter
   * @returns Employee/User's list
   */
  async getEmployeeList(filter: EmployeeFilterAPIDTO) {
    const { role, name, revokedOnly, sortKey, order, limit, skip } = filter;
    const query: FindManyOptions<EmployeeEntity> = {
      order: {
        [sortKey || 'createdDate']: sortKey ? order : 'DESC',
      },
    };

    if (limit) query.take = limit;
    if (skip) query.skip = skip;

    if (!role && !name && !revokedOnly) {
      return this.employeeRepository.findAndCount(query);
    }

    const conditions: (string | ObjectLiteral)[] = [];

    if (role) {
      conditions.push({ role: In(role) });
    }

    if (name) {
      conditions.push(this._nameSearchQuery(name));
    }

    if (revokedOnly) {
      conditions.push({ revoked_access_date: Not(IsNull()) });
    }

    if (conditions.length > 0) {
      return this.employeeRepository.findAndCount({
        where: (qb: SelectQueryBuilder<EmployeeEntity>) => {
          const condition = conditions.shift();
          if (condition) qb.where(condition);
          conditions.forEach(c => qb.andWhere(c));
        },
        ...query,
      });
    } else {
      return this.employeeRepository.findAndCount(query);
    }
  }

  /**
   * Update role of the provided employee list
   * @param ids Employee Ids whose role we are updating
   * @param role role
   */
  async updateRole(ids: string[], role: string): Promise<void> {
    if (!Object.values<string>(ValidRoles).includes(role)) {
      throw new BadRequestException(`Provided role does not exist`);
    }
    if (role == ValidRoles.ROLEADMIN) {
      throw new BadRequestException(`ROLE-ADMIN is only assigned in the database.`);
    }

    const query: FindManyOptions<EmployeeEntity> = {};
    if (ids && ids.length > 0) {
      query.where = { id: In(ids) };
    } else {
      throw new BadRequestException(`Please provide at least one Id`);
    }
    const employees = await this.employeeRepository.count(query);
    if (employees !== ids.length) {
      throw new BadRequestException(
        `All provided Ids does not exist, Provided ids ${ids.length}, exist on system ${employees}`,
      );
    }

    // It's time! let's update role for the provided Ids
    await this.employeeRepository.update(ids, { role: role });
  }

  /**
   * Revoke user access by setting revoked_access_date
   * @param id
   */
  async revokeAccess(id: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new BadRequestException(`No entry found.`);
    }

    if (employee.revoked_access_date) {
      throw new BadRequestException(`User access has already been revoked.`);
    }

    employee.revoked_access_date = new Date();

    return this.employeeRepository.save(employee);
  }

  /**
   * Re-activate user by removing revoked_access_date
   * @param id
   */
  async activate(id: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepository.findOne(id);

    if (!employee) {
      throw new BadRequestException(`No entry found.`);
    }

    if (!employee.revoked_access_date) {
      throw new BadRequestException(`User access has not been revoked.`);
    }

    employee.revoked_access_date = null;
    return this.employeeRepository.save(employee);
  }
}
