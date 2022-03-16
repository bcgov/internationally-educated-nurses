import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ApplicantEntity } from './entity/applicant.entity';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { ApplicantStatusAuditEntity } from './entity/applicantStatusAudit.entity';
import { ApplicantAuditEntity } from './entity/applicantAudit.entity';
import { ApplicantController } from './applicant.controller';
import { ApplicantStatusController } from './applicantStatus.controller';
import { ApplicantService } from './applicant.service';
import { ApplicantStatusService } from './applicantStatus.service';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicantEntity,
      ApplicantStatusEntity,
      ApplicantStatusAuditEntity,
      ApplicantAuditEntity,
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
    ]),
    MailModule,
  ],
  controllers: [
    ApplicantController,
    ApplicantStatusController,
    IENApplicantController,
    IENMasterController,
  ],
  providers: [
    ApplicantService,
    ApplicantStatusService,
    Logger,
    IENApplicantService,
    IENMasterService,
    IENApplicantUtilService,
  ],
  exports: [ApplicantService, IENApplicantService, IENMasterService, IENApplicantUtilService],
})
export class ApplicantModule {}
