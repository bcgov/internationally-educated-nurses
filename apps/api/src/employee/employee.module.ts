import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './entity/employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeService } from './employee.service';
import { RoleEntity } from './entity/role.entity';

@Module({
  controllers: [EmployeeController],
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, IENUsers, RoleEntity]),
    forwardRef(() => AuthModule),
  ],
  providers: [EmployeeService, Logger],
  exports: [EmployeeService],
})
export class EmployeeModule {}
