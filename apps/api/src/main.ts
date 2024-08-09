import { createNestApp } from './app.config';

async function bootstrap() {
  const { app } = await createNestApp();
  app.enableCors({
    origin: process.env.ENV_NAME === 'dev' ? '*' : true,
  });
  await app.init();
  await app.listen(process.env.APP_PORT || 4000);
}
bootstrap();
