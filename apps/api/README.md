<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

This is a normal [NestJS](https://docs.nestjs.com/) project. If you are new to NestJS, be familiar with the concepts of annotation, injection, interceptors, filters, and swagger.

## Bootstrap process

- Initializes AppLogger as a [Winston](https://www.npmjs.com/package/nest-winston) logging service
- Set global prefix
- Initializes [Swagger](https://docs.nestjs.com/openapi/introduction) documents
- Initializes global pipes(validation and trim)
- Initializes global filters(exception filter for logging errors)
- Initializes global interceptors(response interceptor)

> Swagger documentation is provided only for the local runtime but not for the lambda.

## Lambda deployment

NestJS serves the app on your local environment but Lambda does in dev, test, and prod environment.

- [main.ts](src/main.ts) - bootstrap entrypoint on local NextJS runtime
- [lambda.ts](src/lambda.ts) - Lambda handler


## Slack alerts

If SLACK_ALERTS_WEBHOOK_URL is defined and an exception occurs, the error message will be sent to the Slack channel.

## Running the app

Refer to [How to run the apps](../../README.md#how-to-run-the-apps).

## Test

Refer to [Tests](../../README.md#tests)

## Env Setup

For local execution (both application and test) include `env.js` at the beginning of script execution or entry-point

## License

Nest is [MIT licensed](LICENSE).
