import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { IENApplicantAudit } from 'src/applicant/entity/ienapplicant-audit.entity';
import { IENApplicantStatusAudit } from 'src/applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { IENApplicant } from 'src/applicant/entity/ienapplicant.entity';
import { IENEducation } from 'src/applicant/entity/ieneducation.entity';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { IENApplicantJob } from 'src/applicant/entity/ienjob.entity';
import { IENJobLocation } from 'src/applicant/entity/ienjoblocation.entity';
import { IENJobTitle } from 'src/applicant/entity/ienjobtitles.entity';
import { IENStatusReason } from 'src/applicant/entity/ienstatus-reason.entity';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { FormEntity } from 'src/form/entities/form.entity';
import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import config from '../ormconfig';

const getEnvironmentSpecificConfig = (env?: string) => {
  switch (env) {
    case 'production':
      return {
        entities: [join(__dirname, '../**/*.entity.js')],
        migrations: [join(__dirname, '../migration/*.js')],
        logging: ['migration'] as LoggerOptions,
      };
    case 'test':
      return {
        port: parseInt(process.env.TEST_POSTGRES_PORT || '5432'),
        host: process.env.TEST_POSTGRES_HOST,
        username: process.env.TEST_POSTGRES_USERNAME,
        password: process.env.TEST_POSTGRES_PASSWORD,
        database: process.env.TEST_POSTGRES_DATABASE,
        entities: [
          EmployeeEntity,
          FormEntity,
          IENApplicant,
          IENApplicantAudit,
          IENApplicantStatus,
          IENApplicantStatusAudit,
          IENHaPcn,
          IENUsers,
          IENEducation,
          IENJobTitle,
          IENJobLocation,
          IENApplicantJob,
          IENStatusReason,
        ],
        migrations: ['dist/migration/*.js'],
        logging: ['error', 'warn', 'migration'] as LoggerOptions,
      };
    default:
      return {
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/migration/*.js'],
        logging: ['error', 'warn', 'migration'] as LoggerOptions,
      };
  }
};

const nodeEnv = process.env.NODE_ENV;
const environmentSpecificConfig = getEnvironmentSpecificConfig(nodeEnv);

const appOrmConfig: PostgresConnectionOptions = {
  ...config,
  ...environmentSpecificConfig,
  synchronize: false,
  migrationsRun: true,
};
@Module({
  imports: [TypeOrmModule.forRoot(appOrmConfig)],
  providers: [Logger],
})
export class DatabaseModule {}
