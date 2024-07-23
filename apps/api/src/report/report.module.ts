import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportUtilService } from './report.util.service';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';

@Module({
  controllers: [ReportController],
  imports: [
    TypeOrmModule.forFeature([IENApplicantStatus, IENHaPcn]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmployeeModule),
  ],
  providers: [ReportService, ReportUtilService, Logger],
  exports: [ReportService, ReportUtilService],
})
export class ReportModule {}
