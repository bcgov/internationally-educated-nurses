import { Logger } from '@nestjs/common';
import axios from 'axios';
import yaml from 'js-yaml';
import https from 'https';

const webhookUrl = process.env.SLACK_ALERTS_WEBHOOK_URL;

export default async function postToSlack(data: unknown): Promise<void> {
  if (webhookUrl) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      timeout: 20000,
    });
    Logger.log(`Dat that send over slack: ${JSON.stringify(data)}`, 'postToSlack');
    await axios
      .post(
        webhookUrl,
        {
          text: `${'```'}${yaml.dump(data)}${'```'}`,
        },
        {
          httpsAgent: httpsAgent,
          timeout: 20000,
        },
      )
      .then(res => {
        Logger.log(`Sent successfully, ${JSON.stringify(res)}`, 'postToSlack');
      })
      .catch(() => {
        Logger.warn(`Failed to send message to slack`, 'postToSlack');
      });
  } else {
    Logger.warn('SLACK_ALERTS_WEBHOOK_URL not available, Slack alert not sent', 'postToSlack');
  }
}
