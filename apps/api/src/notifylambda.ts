import { Context, Handler } from 'aws-lambda';
import { Logger } from '@nestjs/common';
import postToSlack from './common/postToSlack';

/**
 * Stand alone function that design to handle SQS messages
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: Handler = async (event, _context: Context) => {
  try {
    Logger.log({ event });
    if (event?.Records !== undefined) {
      Logger.log(`Received Records`);
      event?.Records.forEach((item: { body: string }) => {
        Logger.log(`Let's play with object and send Message to slack`);
        Logger.log(item);
        postToSlack(JSON.parse(item.body));
        Logger.log(`Seems, Message sent over slack successfully`);
      });
    }
  } catch (e) {
    Logger.log(e, 'NotifyLambda:Error');
  }
};
