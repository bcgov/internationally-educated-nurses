import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';
import { EndOfJourneyService } from './applicant/endofjourney.service';

/**
 * Design this function to trigger existing NestJs application services without Api-Gateway
 * All the schedule and background job trigger will be added here.
 * Operation like sync data, update database view or trigger db function, etc.
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const eojService = app.get(EndOfJourneyService);
  const logger = app.get(AppLogger);

  logger.log(event, 'END-OF-JOURNEY');
  logger.log(context, 'END-OF-JOURNEY');

  try {
    switch (event.path) {
      case 'end-of-journey-complete':
        logger.log('Start end of journey complete check...', 'END-OF-JOURNEY');
        await eojService.init();
        break;
    }
  } catch (e) {
    logger.error(e, 'END-OF-JOURNEY');
  }
  logger.log('...end end of journey complete check', 'END-OF-JOURNEY');
  // Ensure proper cleanup and closing of connections
  try {
    await app.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('Error closing the app: ' + error.message, 'END-OF-JOURNEY');
    }
    logger.error('Error closing the app: ' + error, 'END-OF-JOURNEY');
  }
};

/**
 * To be locally run by Yarn
 */
if (require.main === module) {
  handler({ path: `${process.argv.pop()}-data` }, {} as Context, () => void 0);
}
