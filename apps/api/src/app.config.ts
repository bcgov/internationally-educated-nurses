import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';
import { AppLogger } from './common/logger.service';
import { Documentation } from './common/documentation';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { ErrorExceptionFilter } from './common/error-exception.filter';
import { TrimPipe } from './common/trim.pipe';
import { API_PREFIX } from './config';

export const validationPipeConfig: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: false,
  enableDebugMessages: false,
  disableErrorMessages: true,
  exceptionFactory: errors => {
    const errorMessages = errors.map(error => {
      const nestedValidationError = error.constraints?.ValidateNestedObject;
      if (nestedValidationError) {
        return JSON.parse(nestedValidationError);
      }

      return error.constraints;
    });
    throw new BadRequestException(errorMessages);
  },
};

export async function createNestApp(): Promise<{
  app: NestExpressApplication;
  expressApp: express.Application;
}> {
  // Express app
  const expressApp = express();
  expressApp.disable('x-powered-by');

  // Nest Application With Express Adapter
  let app: NestExpressApplication;
  if (process.env.RUNTIME_ENV === 'local') {
    app = await NestFactory.create(AppModule, {
      logger: new AppLogger(),
    });
  } else {
    app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    // Adding winston logger
    app.useLogger(new AppLogger());
  }

  // Api prefix api/v1/
  app.setGlobalPrefix(API_PREFIX);

  // Enabling Documentation
  if (process.env.NODE_ENV !== 'production') {
    Documentation(app);
  }

  // Interceptor
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  // Validation pipe
  app.useGlobalPipes(new TrimPipe(), new ValidationPipe(validationPipeConfig));

  // Global Error Filter
  app.useGlobalFilters(new ErrorExceptionFilter(app.get(AppLogger)));

  // Printing the environment variables
  console.table({
    project: process.env.PROJECT,
    envName: process.env.ENV_NAME,
    nodeEnv: process.env.NODE_ENV,
    runtimeEnv: process.env.RUNTIME_ENV,
    alertsEnabled: Boolean(process.env.SLACK_ALERTS_WEBHOOK_URL),
  });
  return {
    app,
    expressApp,
  };
}
