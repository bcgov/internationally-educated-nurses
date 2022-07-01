import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Not,
  IsNull,
  Repository,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { EmailDomains, ValidRoles } from '@ien/common';
import { EmployeeEntity } from './entity/employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeUser } from 'src/common/interface/EmployeeUser';
import { RoleEntity } from './entity/role.entity';

export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(IENUsers)
    private ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async resolveUser(keycloakId: string, userData: Partial<EmployeeEntity>): Promise<EmployeeUser> {
    const existingEmployee = await this.getUserByKeycloakId(keycloakId);
    if (existingEmployee) {
      const org = this._setOrganization(existingEmployee.email);

      if (org) {
        await this.employeeRepository.update(existingEmployee.id, { organization: org });
      }
      return existingEmployee;
    }

    userData.organization = this._setOrganization(userData.email);
    const newUser = this.employeeRepository.create(userData);
    const employee = await this.employeeRepository.save(newUser);
    const user = await this.getUser(userData.email);
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
    const employee = await this.employeeRepository.findOne({ where: { keycloakId } });
    if (!employee) {
      throw new BadRequestException('employee not found');
    }
    const user = await this.getUser(employee.email);
    return { ...employee, user_id: user?.id || null };
  }

  async getUser(email: string | undefined): Promise<IENUsers | undefined> {
    return this.ienUsersRepository.findOne({ email });
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

    const conditions: (string | ObjectLiteral | ObjectLiteral[])[] = [];

    if (name) {
      conditions.push(this._nameSearchQuery(name));
    }

    if (revokedOnly) {
      conditions.push({ revoked_access_date: Not(IsNull()) });
    }

    if (role && role.length > 0) {
      conditions.push(`EmployeeEntity__roles.id IN(${role.join(',')})`);
    }

    if (conditions.length > 0) {
      return this.employeeRepository.findAndCount({
        relations: ['roles'],
        where: (qb: SelectQueryBuilder<EmployeeEntity>) => {
          const condition = conditions.shift();
          if (condition) {
            qb.where(condition);
            conditions.forEach(c => qb.andWhere(c));
          }
        },
        ...query,
      });
    }
    return this.employeeRepository.findAndCount(query);
  }

  /**
   * Update role of the provided employee list
   * @param ids Employee Ids whose role we are updating
   * @param role role
   */
  async updateRole(id: string, role_ids: number[]): Promise<EmployeeEntity> {
    const roles = await this.roleRepository.findByIds(role_ids);
    role_ids.forEach(role_id => {
      if (!roles.find(role => role.id === role_id)) {
        throw new BadRequestException(`Provided role does not exist`);
      }
    });
    if (roles.find(role => role.name === ValidRoles.ROLEADMIN)) {
      throw new BadRequestException(`ROLE-ADMIN is only assigned in the database.`);
    }

    const employee = await this.employeeRepository.findOne(id);
    if (!employee) {
      throw new BadRequestException(`Please provide at least one Id`);
    }

    employee.roles = roles;
    await this.employeeRepository.save(employee);
    return employee;
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

  async getRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }
}
