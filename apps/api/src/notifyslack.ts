import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';

/**
 * Design this function to trigger existing NestJs appliation services without Api-Getway
 * All the schedule and backgroud job trigger will be added here.
 * Opertion like sync data, update database view or trigger db function, etc.
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);

  const appLogger = app.get(AppLogger);
  appLogger.log({ event });
  appLogger.log({ context });
  try {
    /*eslint no-console: */
    console.log(event);
  } catch (e) {
    appLogger.error(e);
  }
  appLogger.log('...end SyncData');
};
