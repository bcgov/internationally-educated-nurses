import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportUtilService } from './report.util.service';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { ReportS3Service } from './report.s3.service';
import { ReportCacheEntity } from './entity/report-cache.entity';

@Module({
  controllers: [ReportController],
  imports: [
    TypeOrmModule.forFeature([IENApplicantStatus, IENHaPcn, ReportCacheEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmployeeModule),
  ],
  providers: [ReportService, ReportUtilService, Logger, ReportS3Service],
  exports: [ReportService, ReportUtilService],
})
export class ReportModule {}
