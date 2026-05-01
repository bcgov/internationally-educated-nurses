import { createNestApp } from './app.config';

async function bootstrap() {
  console.log(`node-version: ${process.version}`);
  const { app } = await createNestApp();
  app.enableCors({
    origin: process.env.ENV_NAME === 'dev' ? '*' : true,
  });
  await app.init();
  await app.listen(process.env.APP_PORT || 4000);
}
bootstrap();
