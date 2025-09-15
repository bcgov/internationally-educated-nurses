import { Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: process.env.AWS_S3_REGION });
const sqsQueueUrl = process.env.SQS_QUEUE_URL;

export default function sendToSQS(data: unknown) {
  if (sqsQueueUrl) {
    try {
      Logger.log('SQS function triggered');
      const command = new SendMessageCommand({
        MessageBody: JSON.stringify(data),
        QueueUrl: sqsQueueUrl,
      });
      Logger.log('Sending message', 'sendToSQS');
      sqsClient
        .send(command)
        .then(res =>
          Logger.log(`Successfully added message to queue ${res.MessageId}`, 'sendToSQS'),
        )
        .catch(err => Logger.warn(err, 'sendToSQS:Error'));
    } catch (e) {
      Logger.warn(e, 'sendToTeams:Error');
    }
  } else {
    Logger.warn('SQS_QUEUE_URL not available, Message not sent', 'sendToTeams');
    Logger.log(data);
  }
}
