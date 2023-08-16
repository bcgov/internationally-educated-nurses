import { Logger, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';
import { ApplicantModule } from '../applicant/applicant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IENApplicant } from '../applicant/entity/ienapplicant.entity';

@Module({
  controllers: [AdminController],
  imports: [TypeOrmModule.forFeature([IENApplicant]), AuthModule, EmployeeModule, ApplicantModule],
  providers: [AdminService, Logger],
})
export class AdminModule {}
