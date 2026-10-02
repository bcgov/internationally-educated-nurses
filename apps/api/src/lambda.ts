import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { Logger } from '@nestjs/common';
import { createNestApp } from './app.config';
import { logRuntimeTzdata } from './common/runtime-tzdata';

type ProxyHandler = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<APIGatewayProxyResult>;

let cachedServer: ProxyHandler;
const logger = new Logger('LambdaBootstrap');

async function bootstrap() {
  if (!cachedServer) {
    logger.log(`node-version: ${process.version}`);
    logRuntimeTzdata();
    const { app: nestApp } = await createNestApp();
    await nestApp.init();
    // Library types demand a callback, but its default PROMISE mode never uses one
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    }) as unknown as ProxyHandler;
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const cachedServerHandler = await bootstrap();
  return cachedServerHandler(event, context);
};
