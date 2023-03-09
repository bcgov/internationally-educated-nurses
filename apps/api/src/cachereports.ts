import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';
import { ReportService } from './report/report.service';

/**
 * Design this function to trigger existing NestJs appliation services without Api-Getway
 * All the schedule and backgroud job trigger will be added here.
 * This handler will cache the report 4 data for every existing period
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const reportService = app.get(ReportService);

  const appLogger = app.get(AppLogger);
  appLogger.log({ event });
  appLogger.log({ context });
  try {
    if (event.path === 'cache-reports') {
      appLogger.log('Start caching reports...');

      await reportService.updateReportCache();
    }
  } catch (e) {
    appLogger.error(e);
  }
  appLogger.log('...end caching reports');
};
