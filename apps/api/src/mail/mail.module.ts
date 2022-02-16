import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionEntity } from 'src/submission/entity/submission.entity';
import { MailService } from './mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmissionEntity])],
  providers: [MailService, Logger],
  exports: [MailService],
})
export class MailModule {}
