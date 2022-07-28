import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './entity/employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeService } from './employee.service';
import { RoleEntity } from './entity/role.entity';
import { AccessEntity } from './entity/acl.entity';
import { EmployeeExternalAPIService } from './employee-external-api.service';
import { EmployeeExternalAPIController } from './employee-external-api.controller';

@Module({
  controllers: [EmployeeController, EmployeeExternalAPIController],
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, IENUsers, RoleEntity, AccessEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [EmployeeService, Logger, EmployeeExternalAPIService],
  exports: [EmployeeService, EmployeeExternalAPIService],
})
export class EmployeeModule {}
