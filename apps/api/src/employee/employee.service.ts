import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
