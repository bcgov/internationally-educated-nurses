import { Context, Handler } from 'aws-lambda';
import { Logger } from '@nestjs/common';
import postToTeams from './common/postToTeams';

/**
 * Stand alone function that design to handle SQS messages
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler: Handler = async (event, _context: Context) => {
  try {
    Logger.log({ event });
    if (event?.Records !== undefined) {
      Logger.log(`Received Records`);
      for (const item of event.Records) {
        Logger.log(`Let's play with object and send Message to teams`);
        Logger.log(item);
        await postToTeams(JSON.parse(item.body));
        Logger.log(`Seems, Message sent over teams successfully`);
      }
    }
  } catch (e) {
    Logger.log(e, 'NotifyLambda:Error');
  }
};
