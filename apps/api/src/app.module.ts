import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SubmissionModule } from './submission/submission.module';
import { AppLogger } from './common/logger.service';

@Module({
  imports: [DatabaseModule, SubmissionModule],
  controllers: [AppController],
  providers: [AppService, AppLogger],
})
export class AppModule {}
