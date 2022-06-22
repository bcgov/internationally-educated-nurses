import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  In,
  Repository,
  getManager,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { Organizations, EmailDomains, ValidRoles } from '@ien/common';
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
      return existingEmployee;
    }

    userData.organization = this._setOrganization(userData.email);
    const newUser = this.employeeRepository.create(userData);
    const employee = await this.employeeRepository.save(newUser);
    const user = await this.getUserId(userData.email);
    const empUser: EmployeeUser = {
      ...employee,
      user_id: user ? user.id : null,
    };
    return empUser;
  }

  _checkDomain(domain: string, email: string) {
    return email.includes(domain);
  }

  _setOrganization(email?: string): string | undefined {
    if (!email) {
      return undefined;
    }
    // ministry of health
    if (EmailDomains.MINISTRY_OF_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.MINISTRY_OF_HEALTH;
    }
    //health match bc
    if (EmailDomains.HEALTH_MATCH.some(e => this._checkDomain(e, email))) {
      return Organizations.HEALTH_MATCH;
    }
    //first nations health authority
    if (EmailDomains.FIRST_NATIONS_HEALTH_AUTHORITY.some(e => this._checkDomain(e, email))) {
      return Organizations.FIRST_NATIONS_HEALTH_AUTHORITY;
    }
    //providence health care
    if (EmailDomains.PROVIDENCE_HEALTH_CARE.some(e => this._checkDomain(e, email))) {
      return Organizations.PROVIDENCE_HEALTH_CARE;
    }
    //providence health services authority
    if (EmailDomains.PROVINCIAL_HEALTH_SERVICES_AUTHORITY.some(e => this._checkDomain(e, email))) {
      return Organizations.PROVINCIAL_HEALTH_SERVICES_AUTHORITY;
    }
    // fraser health
    if (EmailDomains.FRASER_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.FRASER_HEALTH;
    }
    //interior health
    if (EmailDomains.INTERIOR_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.INTERIOR_HEALTH;
    }
    //island health
    if (EmailDomains.ISLAND_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.ISLAND_HEALTH;
    }
    //northern health
    if (EmailDomains.NORTHERN_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.NORTHERN_HEALTH;
    }
    //vancouver coastal health
    if (EmailDomains.VANCOUVER_COASTAL_HEALTH.some(e => this._checkDomain(e, email))) {
      return Organizations.VANCOUVER_COASTAL_HEALTH;
    }

    return undefined;
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

  async getUserId(email: string | undefined): Promise<IENUsers | undefined> {
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
    const { role, name, sortKey, order, limit, skip } = filter;
    const query: FindManyOptions<EmployeeEntity> = {
      order: {
        [sortKey || 'createdDate']: sortKey ? order : 'DESC',
      },
    };

    if (limit) query.take = limit;
    if (skip) query.skip = skip;

    if (!role && !name) {
      return this.employeeRepository.findAndCount(query);
    }

    const conditions: (string | ObjectLiteral)[] = [];

    if (role) {
      conditions.push({ role: In(role) });
    }

    if (name) {
      conditions.push(this._nameSearchQuery(name));
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
      throw new BadRequestException(`Please provide atleast one Id`);
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
}
