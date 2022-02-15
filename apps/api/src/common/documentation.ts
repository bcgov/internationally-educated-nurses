import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SubmissionModule } from 'src/submission/submission.module';

export const Documentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('EHPR API Documentation')
    .setDescription('API to collection form submission')
    .setVersion(`1.0.0`)
    .build();

  const baseDocument = SwaggerModule.createDocument(app, options, {
    include: [SubmissionModule],
  });

  SwaggerModule.setup('api', app, baseDocument, {
    swaggerOptions: {
      docExpansion: 'none',
      displayRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });
};
