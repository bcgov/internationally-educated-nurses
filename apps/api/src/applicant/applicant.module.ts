import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { ApplicantEntity } from './entity/applicant.entity';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { ApplicantController } from './applicant.controller';
import { ApplicantStatusController } from './applicantStatus.controller';
import { ApplicantService } from './applicant.service';
import { ApplicantStatusService } from './applicantStatus.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicantEntity, ApplicantStatusEntity]), MailModule],
  controllers: [ApplicantController, ApplicantStatusController],
  providers: [ApplicantService, ApplicantStatusService, Logger],
  exports: [ApplicantService],
})
export class ApplicantModule {}
