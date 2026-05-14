import serverlessExpress from '@vendia/serverless-express';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Callback,
  Handler,
} from 'aws-lambda';
import { Logger } from '@nestjs/common';
import { createNestApp } from './app.config';

let cachedServer: Handler;
const logger = new Logger('LambdaBootstrap');

async function bootstrap() {
  if (!cachedServer) {
    logger.log(`node-version: ${process.version}`);
    const { app: nestApp } = await createNestApp();
    await nestApp.init();
    cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
): Promise<APIGatewayProxyResult> => {
  const cachedServerHandler = await bootstrap();
  return cachedServerHandler(event, context, callback);
};
