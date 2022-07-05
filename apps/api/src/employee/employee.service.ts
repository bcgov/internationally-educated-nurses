import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, IsNull, Repository } from 'typeorm';
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
    const pending = await this.roleRepository.findOne({ name: ValidRoles.PENDING });
    if (pending) {
      newUser.roles = [pending];
    }
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
    if (employee) {
      const user = await this.getUser(employee.email);
      return { ...employee, user_id: user?.id || null };
    }
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
  async getEmployeeList(filter: EmployeeFilterAPIDTO): Promise<[EmployeeEntity[], number]> {
    const { role, name, revokedOnly, sortKey, order, limit, skip } = filter;
    const qb = this.employeeRepository
      .createQueryBuilder('employee')
      .orderBy({ [sortKey || 'created_date']: order || 'DESC' });

    if (limit) qb.limit(limit);
    if (skip) qb.skip(skip);

    if (name) {
      qb.andWhere(this._nameSearchQuery(name));
    }

    if (revokedOnly) {
      qb.andWhere({ revoked_access_date: Not(IsNull()) });
    }

    if (!role?.length) {
      qb.leftJoinAndSelect('employee.roles', 'role');
      return qb.getManyAndCount();
    }

    qb.select('employee.id');
    qb.innerJoinAndSelect(
      'employee.roles',
      'role',
      role ? `role.id IN(${role.join(',')})` : undefined,
    );
    const [employee_ids, count] = await qb.getManyAndCount();

    const employees = await this.employeeRepository.findByIds(employee_ids, {
      relations: ['roles'],
    });
    return [employees, count];
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
