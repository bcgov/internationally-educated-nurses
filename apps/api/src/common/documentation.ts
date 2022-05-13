import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicantModule } from 'src/applicant/applicant.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { FormModule } from 'src/form/form.module';
import { ReportModule } from 'src/report/report.module';

export const Documentation = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('IEN API Documentation')
    .setDescription("API to perform operations on applicants' application")
    .setVersion(`1.0.0`)
    .build();

  const baseDocument = SwaggerModule.createDocument(app, options, {
    include: [ApplicantModule, FormModule, EmployeeModule, ReportModule],
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
