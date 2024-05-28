import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import dayjs from 'dayjs';
import { AppModule } from './app.module';
import { ExternalAPIService } from './applicant/external-api.service';
import { AppLogger } from './common/logger.service';
import { MailService } from './mail/mail.service';

/**
 * Design this function to trigger existing NestJs application services without Api-Gateway
 * All the schedule and background job trigger will be added here.
 * Operation like sync data, update database view or trigger db function, etc.
 */
export const handler: Handler = async (event, context: Context) => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const externalAPIService = app.get(ExternalAPIService);
  const logger = app.get(AppLogger);

  logger.log(event, 'ATS-SYNC');
  logger.log(context, 'ATS-SYNC');

  try {
    if (event.path === 'master-data') {
      logger.log('Start master data import...', 'ATS-SYNC');
      await externalAPIService.saveData();
    } else if (event.path === 'applicant-data') {
      logger.log('Start applicant data import...', 'ATS-SYNC');
      let from = undefined;
      let to = undefined;
      let page = undefined;
      const regex = new RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/); //yyyy-mm-dd
      if (event.hasOwnProperty('from') && regex.test(event.from)) {
        from = event.from;
      }
      if (event.hasOwnProperty('to') && regex.test(event.to)) {
        to = event.to;
      }
      if (event.hasOwnProperty('page')) {
        page = event.page;
      }
      await externalAPIService.saveApplicant(from, to, page);
    }
  } catch (e) {
    logger.error(e, 'ATS-SYNC');
    const to = process.env.MAIL_RECIPIENTS;
    if (to) {
      const mailService = app.get(MailService);
      await mailService.sendMailWithSES({
        body: `${e.message}: ${e.stack}`,
        from: process.env.MAIL_FROM ?? 'IENDoNotReply@ien.gov.bc.ca',
        subject: `[IEN] Syncing ${event.path} failed at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
        to: to.split(','),
      });
    }
  }
  logger.log('...end SyncData', 'ATS-SYNC');
  await app.close();
};

/**
 * To be locally run by Yarn
 */
if (require.main === module) {
  handler({ path: `${process.argv.pop()}-data` }, {} as Context, () => void 0);
}
