import { Context, Handler } from 'aws-lambda';
import { Logger } from '@nestjs/common';

/**
 * Stand alone function that design to handle SQS messages
 */
export const handler: Handler = async (event, context: Context) => {
  try {
    Logger.log({ event });
    Logger.log({ context });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
