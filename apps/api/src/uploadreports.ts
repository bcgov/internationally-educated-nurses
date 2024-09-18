import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';
import { ReportS3Service } from './report/report.s3.service';

/**
 * Design this function to trigger existing NestJs appliation services without Api-Getway
 * All the schedule and backgroud job trigger will be added here.
 * This handler will cache the report 4 data for every existing period
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const reportS3Service = app.get(ReportS3Service);

  const appLogger = app.get(AppLogger);
  appLogger.log({ event });
  appLogger.log({ context });
  try {
    if (event.hasOwnProperty('s3Key') && event.hasOwnProperty('data')) {
      const { s3Key, data } = event;
      appLogger.log('Start uploading reports...');

      await reportS3Service
        .uploadFile(s3Key, data)
        .then(() => {
          appLogger.log('File uploaded successfully.');
        })
        .catch(err => {
          appLogger.error('File upload failed: ', err);
        });
    }
  } catch (e) {
    appLogger.error(e);
  }
  appLogger.log('...end caching reports');
};
