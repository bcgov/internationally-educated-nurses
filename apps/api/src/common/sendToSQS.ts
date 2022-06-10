import { Logger } from '@nestjs/common';
import AWS from 'aws-sdk';
AWS.config.update({ region: process.env.AWS_S3_REGION });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
const sqsQueueUrl = process.env.SQS_QUEUE_URL;

export default async function sendToSQS(data: unknown): Promise<void> {
  if (sqsQueueUrl) {
    try {
      Logger.log('SQS function triggered, Lets send message');
      const params = {
        MessageBody: JSON.stringify(data),
        QueueUrl: sqsQueueUrl,
      };
      Logger.log('Sending message', 'sendToSQS');
      const message = await SQS.sendMessage(params).promise();
      Logger.log('message sent', 'sendToSQS');
      Logger.log({ message });
    } catch (e) {
      Logger.log('Error while sending Message');
      Logger.log(e);
    }
  } else {
    Logger.warn('SQS_QUEUE_URL not available, Message not sent', 'sendToSlack');
  }
}
