import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantAudit } from './entity/ienapplicant-audit.entity';
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENApplicantController } from './ienapplicant.controller';
import { IENApplicantService } from './ienapplicant.service';
import { IENMasterController } from './ien-master.controller';
import { IENMasterService } from './ien-master.service';
import { IENEducation } from './entity/ieneducation.entity';
import { IENApplicantUtilService } from './ienapplicant.util.service';
import { IENJobTitle } from './entity/ienjobtitles.entity';
import { IENJobLocation } from './entity/ienjoblocation.entity';
import { IENApplicantJob } from './entity/ienjob.entity';
import { ExternalAPIController } from './external-api.controller';
import { ExternalAPIService } from './external-api.service';
import { ExternalRequest } from 'src/common/external-request';
import { IENStatusReason } from './entity/ienstatus-reason.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IENApplicant,
      IENApplicantAudit,
      IENApplicantStatus,
      IENApplicantStatusAudit,
      IENHaPcn,
      IENUsers,
      IENEducation,
      IENJobTitle,
      IENJobLocation,
      IENApplicantJob,
      IENStatusReason,
    ]),
    AuthModule,
    EmployeeModule,
    MailModule,
  ],
  controllers: [IENApplicantController, IENMasterController, ExternalAPIController],
  providers: [
    Logger,
    IENApplicantService,
    IENMasterService,
    IENApplicantUtilService,
    ExternalAPIService,
    ExternalRequest,
  ],
  exports: [
    IENApplicantService,
    IENMasterService,
    IENApplicantUtilService,
    ExternalAPIService,
    ExternalRequest,
  ],
})
export class ApplicantModule {}
