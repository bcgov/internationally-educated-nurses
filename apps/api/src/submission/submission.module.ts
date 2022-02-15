import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { SubmissionEntity } from './entity/submission.entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionEntity]), MailModule],
  controllers: [SubmissionController],
  providers: [SubmissionService, Logger],
  exports: [SubmissionService],
})
export class SubmissionModule {}
