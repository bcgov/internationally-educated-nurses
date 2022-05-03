import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeController } from './employee.controller';
import { EmployeeEntity } from './employee.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeService } from './employee.service';

@Module({
  controllers: [EmployeeController],
  imports: [TypeOrmModule.forFeature([EmployeeEntity, IENUsers]), forwardRef(() => AuthModule)],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
