import { AppLogger } from 'src/common/logger.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getManager } from 'typeorm';

import { EmployeeService } from './employee.service';
import { EmployeeEntity } from './entity/employee.entity';

@Injectable()
export class EmployeeExternalAPIService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(EmployeeService) private readonly employeeService: EmployeeService,
  ) {}

  async getEmployeeData() {
    try {
      const employees = await getManager()
        .createQueryBuilder(EmployeeEntity, 'employee')
        .select('employee')
        .leftJoinAndSelect('employee.roles', 'role')
        .where('role IS NOT NULL')
        .leftJoinAndSelect('role.acl', 'acl')
        .getMany();

      return employees;
    } catch (e) {
      this.logger.log(`Error retrieving Employee Data (getEmployeeData()): ${e}`);
    }
  }
}
