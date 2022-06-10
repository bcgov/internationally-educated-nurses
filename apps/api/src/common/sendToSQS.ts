import { Logger } from '@nestjs/common';
import AWS from 'aws-sdk';
AWS.config.update({ region: process.env.AWS_S3_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
const sqsQueueUrl = process.env.SQS_QUEUE_URL;

export default function sendToSQS(data: unknown): void {
  if (sqsQueueUrl) {
    // eslint-disable-next-line no-console
    console.log('SQS function triggered, Lets send message');
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: sqsQueueUrl,
    };

    SQS.sendMessage(params, (err, result) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log({err});
        return;
      }
      // eslint-disable-next-line no-console
      console.log({result});
    });
  } else {
    Logger.warn('SQS_QUEUE_URL not available, Message not sent', 'sendToSlack');
  }
}
