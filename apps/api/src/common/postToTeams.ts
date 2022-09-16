import { Logger } from '@nestjs/common';
import axios from 'axios';
import yaml from 'js-yaml';
import https from 'https';

const webhookUrl = process.env.TEAMS_ALERTS_WEBHOOK_URL;

export default async function postToTeams(data: unknown): Promise<void> {
  if (webhookUrl) {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      timeout: 20000,
    });
    Logger.log(`Data that send over teams: ${JSON.stringify(data)}`, 'postToTeams');
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
        Logger.log(`Sent successfully, ${JSON.stringify(res)}`, 'postToTeams');
      })
      .catch(() => {
        Logger.warn(`Failed to send message to teams`, 'postToTeams');
      });
  } else {
    Logger.warn('TEAMS_ALERTS_WEBHOOK_URL not available, Teams alert not sent', 'postToTeams');
  }
}
