import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, IsNull, Repository, getManager, In } from 'typeorm';
import { Authorities, Authority, Employee, EmployeeRO, RoleSlug } from '@ien/common';
import { EmployeeEntity } from './entity/employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { RoleEntity } from './entity/role.entity';
import { DefaultRoles } from '@ien/common/dist/enum/default-roles';

export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(IENUsers)
    private ienUsersRepository: Repository<IENUsers>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async resolveUser(keycloakId: string, userData: Partial<EmployeeEntity>): Promise<EmployeeRO> {
    let employee: Employee | undefined = await this.getUserByKeycloakId(keycloakId);

    let needToSave = false;
    if (!employee) {
      employee = this.employeeRepository.create(userData);
      needToSave = true;
    }

    if (!employee.organization) {
      const authority = this._getOrganization(employee.email);
      if (authority) {
        employee.organization = authority.name;
        if (Object.keys(DefaultRoles).includes(authority.id)) {
          employee.roles = await this.getDefaultRoles(authority.id);
        }
        needToSave = true;
      }
    }
    needToSave && (await this.employeeRepository.save(employee));

    const user = await this.getUser(userData); // It will add new user record if not exist.

    return { ...employee, user_id: user ? user.id : null };
  }

  _getOrganization(email?: string): Authority | undefined {
    if (!email) {
      return undefined;
    }
    // get domain from email string
    const domain = email.substring(email.lastIndexOf('@') + 1);

    //return organization or undefined
    return Object.values(Authorities).find(a => a.domains.includes(domain));
  }

  async getUserByKeycloakId(keycloakId: string): Promise<EmployeeRO | undefined> {
    const employeeUser = await getManager()
      .createQueryBuilder(EmployeeEntity, 'employee')
      .select('employee.*')
      .addSelect('users.id', 'user_id')
      .addSelect('ha_pcn.id', 'ha_pcn_id')
      .leftJoin('ien_users', 'users', 'employee.email = users.email')
      .leftJoin('ien_ha_pcn', 'ha_pcn', 'employee.organization = ha_pcn.title')
      .where('employee.keycloak_id = :keyclock', { keyclock: keycloakId }) // WHERE t3.event = 2019
      .getRawOne();

    if (employeeUser) {
      const employee = await this.employeeRepository.findOne({ where: { keycloakId } });
      return { ...employeeUser, ...employee };
    }
  }

  async getUser(userData: Partial<EmployeeEntity>): Promise<IENUsers | undefined> {
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
        tempConditions.push(`employee.name ilike '%${ele}%'`);
      });
      return tempConditions.join(' AND ');
    }
    return `employee.name ilike '%${keyword}%'`;
  }

  /**
   * List and filter employees,
   * Only for administrator purposes
   * We will build UI for this when we extend our scope to provide user-management
   * @param name optional name wise filter
   * @returns Employee/User's list
   */
  async getEmployeeList(
    filter: EmployeeFilterAPIDTO,
    user: Employee,
  ): Promise<[EmployeeEntity[], number]> {
    const { role, name, revokedOnly, sortKey, order, limit, skip } = filter;

    const qb = this.employeeRepository.createQueryBuilder('employee');

    qb.where({ id: Not(user.id) });

    if (name) {
      qb.andWhere(this._nameSearchQuery(name));
    }

    if (revokedOnly) {
      qb.andWhere({ revoked_access_date: Not(IsNull()) });
    }

    if (
      !user.roles.some(({ slug }) => slug === RoleSlug.Admin) &&
      user.organization !== Authorities.HMBC.name
    ) {
      qb.andWhere({ organization: user.organization });
    }

    if (role?.length) {
      qb.innerJoinAndSelect(
        'employee.roles',
        'role',
        role ? `role.id IN(${role.join(',')})` : undefined,
      );
    } else {
      qb.leftJoinAndSelect('employee.roles', 'role');
    }

    const sortKeyword = sortKey ? `employee.${sortKey}` : 'employee.created_date';
    qb.orderBy({ [sortKeyword]: order || 'DESC' });

    const employees = await qb.getMany();

    const start = skip ? +skip : 0;
    const end = limit ? +limit + start : employees.length;

    return [employees.slice(start, end), employees.length];
  }

  /**
   * Update role of the provided employee list
   * @param ids Employee Ids whose role we are updating
   * @param role role
   */
  async updateRoles(id: string, role_ids: number[]): Promise<EmployeeEntity> {
    const roles = await this.roleRepository.findByIds(role_ids);
    role_ids.forEach(role_id => {
      if (!roles.find(role => role.id === role_id)) {
        throw new BadRequestException(`Provided role does not exist`);
      }
    });
    if (roles.find(role => role.slug === RoleSlug.Admin)) {
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

  async getEmployee(id: string): Promise<EmployeeRO | undefined> {
    const employee = await this.employeeRepository.findOne(id);
    if (!employee) return undefined;

    const employeeUser = await getManager()
      .createQueryBuilder(EmployeeEntity, 'employee')
      .select('employee.*')
      .addSelect('users.id', 'user_id')
      .addSelect('ha_pcn.id', 'ha_pcn_id')
      .leftJoin('ien_users', 'users', 'employee.email = users.email')
      .leftJoin('ien_ha_pcn', 'ha_pcn', 'employee.organization = ha_pcn.title')
      .where('employee.id = :id', { id })
      .getRawOne();

    return { ...employeeUser, ...employee };
  }

  async getDefaultRoles(userType: keyof typeof DefaultRoles): Promise<RoleEntity[]> {
    return this.roleRepository.find({ slug: In(DefaultRoles[userType]) });
  }
}
