import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppLogger } from './common/logger.service';
import { ApplicantModule } from './applicant/applicant.module';
import { FormModule } from './form/form.module';
import { EmployeeModule } from './employee/employee.module';
// import { AuthenticationMiddleware } from './common/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [DatabaseModule, FormModule, ApplicantModule, EmployeeModule, AuthModule, ReportModule],
  controllers: [AppController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
