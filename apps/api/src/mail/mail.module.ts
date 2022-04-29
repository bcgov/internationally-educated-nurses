import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [MailService, Logger],
  exports: [MailService],
})
export class MailModule {}
