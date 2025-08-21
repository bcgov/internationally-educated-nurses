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
  let from = undefined;
  let to = undefined;
  let page = undefined;
  const regex = new RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/); //yyyy-mm-dd

  try {
    switch (event.path) {
      case 'master-data':
        logger.log('Start master data import...', 'ATS-SYNC');
        await externalAPIService.saveData();
        break;
      case 'applicant-data':
        logger.log('Start applicant data import...', 'ATS-SYNC');
        if (event.hasOwnProperty('from') && regex.test(event.from)) {
          from = event.from;
        } else {
          from = dayjs().add(-1, 'day').format('YYYY-MM-DD');
        }
        if (event.hasOwnProperty('to') && regex.test(event.to)) {
          to = event.to;
        } else {
          to = dayjs().format('YYYY-MM-DD');
        }
        if (event.hasOwnProperty('page')) {
          page = event.page;
        }
        if (process.env.PROTOTYPE_SYNC && !page) {
          await externalAPIService.slicedSync(from, to);
        } else {
          await externalAPIService.saveApplicant(from, to, page);
        }

        break;
    }
  } catch (e) {
    logger.error(e, 'ATS-SYNC');
    const to = process.env.MAIL_RECIPIENTS || '';
    const mailService = app.get(MailService);
    if (to) {
      await mailService.sendMailWithSES({
        body: `${e instanceof Error ? e.message : String(e)}: ${e instanceof Error ? e.stack : ''}`,
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
