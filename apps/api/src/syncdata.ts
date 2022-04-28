import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { ExternalAPIService } from './applicant/external-api.service';
import { AppLogger } from './common/logger.service';

/**
 * Design this function to trigger existing NestJs appliation services without Api-Getway
 * All the schedule and backgroud job trigger will be added here.
 * Opertion like sync data, update database view or trigger db function, etc.
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const externalAPIService = app.get(ExternalAPIService);
  const appLogger = app.get(AppLogger);
  appLogger.log({ event });
  appLogger.log({ context });
  try {
    if (event.hasOwnProperty('path')) {
      if (event.path === 'master-data') {
        appLogger.log('Start master data import...');
        await externalAPIService.saveData();
      } else if (event.path === 'applicant-data') {
        appLogger.log('Start applicant data import...');
        let from = undefined;
        let to = undefined;
        const regex = new RegExp(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12]\d{1}|3[01])$/); //yyyy-mm-dd
        if (event.hasOwnProperty('from') && regex.test(event.from)) {
          from = event.from;
        }
        if (event.hasOwnProperty('to') && regex.test(event.to)) {
          to = event.to;
        }
        await externalAPIService.saveApplicant(from, to);
      }
    }
  } catch (e) {
    appLogger.error(e);
  }
  appLogger.log('...end SyncData');
};
