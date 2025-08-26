import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';
import { ReportService } from './report/report.service';
import { ReportS3Service } from './report/report.s3.service';

let app: unknown = null;

/**
 * Design this function to trigger existing NestJs appliation services without Api-Getway
 * All the schedule and backgroud job trigger will be added here.
 * This handler will cache the report 4 data for every existing period
 */
export const handler: Handler = async (event, context: Context) => {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }
  const reportS3Service = app.get(ReportS3Service);
  const reportService = app.get(ReportService);

  const appLogger = app.get(AppLogger);
  appLogger.log({ event });
  appLogger.log({ context });
  try {
    if (
      event.hasOwnProperty('s3Key') &&
      event.hasOwnProperty('param') &&
      event.hasOwnProperty('path')
    ) {
      const { s3Key, path, param } = event;
      appLogger.log('Start uploading reports...');
      let data = [];
      if (path === 'extract-data') {
        data = await reportService.extractApplicantsData(
          { from: param.from, to: param.to },
          param.ha_pcn_id,
        );
      } else if (path === 'extract-milestone') {
        data = await reportService.extractMilestoneData(
          { from: param.from, to: param.to },
          param.ha_pcn_id,
        );
      }
      await reportS3Service
        .uploadFile(s3Key, data)
        .then(() => {
          appLogger.log('File uploaded successfully.');
        })
        .catch((err: unknown) => {
          appLogger.error('File upload failed: ', err);
        });
    }
  } catch (e) {
    appLogger.error(e);
  }
  appLogger.log('...end caching reports');
};
