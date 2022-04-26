import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/auth.constants';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { EmployeeEntity } from './employee.entity';

export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}
  // TODO Find a more elegant way of upserting a user
  async resolveUser(
    keycloakId: string,
    userData: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity> {
    const existingEmployee = await this.getUserByKeycloakId(keycloakId);
    if (existingEmployee) {
      return existingEmployee;
    }
    const newUser = this.employeeRepository.create(userData);
    return await this.employeeRepository.save(newUser);
  }
  async getUserByKeycloakId(keycloakId: string): Promise<EmployeeEntity | undefined> {
    return await this.employeeRepository.findOne({ keycloakId });
  }

  /**
   * List and filter employees,
   * Only for administrator purposes
   * We will build UI for this when we extend our scope to provide user-management
   * @param name optional name wise filter
   * @returns Employee/User's list
   */
  async getEmployeeList(name: string): Promise<EmployeeEntity[]> {
    const query: FindManyOptions<EmployeeEntity> = {
      select: ['id', 'name', 'role'],
    };
    if (name && name != '') {
      query.where = { name: ILike(`%${name}%`) };
    }
    return await this.employeeRepository.find(query);
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
