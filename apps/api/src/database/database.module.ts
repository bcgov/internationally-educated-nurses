import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { LoggerOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from '../ormconfig';
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
import { SyncApplicantsAudit } from 'src/applicant/entity/sync-applicants-audit.entity';
import { EmployeeEntity } from 'src/employee/entity/employee.entity';
import { FormEntity } from 'src/form/entity/form.entity';
import { RoleEntity } from '../employee/entity/role.entity';
import { AccessEntity } from '../employee/entity/acl.entity';
import { ReportCacheEntity } from 'src/report/entity/report-cache.entity';
import { IENApplicantRecruiter } from '../applicant/entity/ienapplicant-employee.entity';
import { IENApplicantActiveFlag } from 'src/applicant/entity/ienapplicant-active-flag.entity';
import { Pathway } from '../applicant/entity/pathway.entity';

const getEnvironmentSpecificConfig = (env?: string): Partial<PostgresConnectionOptions> => {
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
          AccessEntity,
          EmployeeEntity,
          FormEntity,
          IENApplicant,
          IENApplicantAudit,
          IENApplicantJob,
          IENApplicantStatus,
          IENApplicantStatusAudit,
          IENApplicantActiveFlag,
          IENEducation,
          IENHaPcn,
          IENJobLocation,
          IENJobTitle,
          IENStatusReason,
          IENUsers,
          IENApplicantRecruiter,
          Pathway,
          RoleEntity,
          SyncApplicantsAudit,
          ReportCacheEntity,
        ],
        migrations: ['dist/migration/*.js'],
        logging: ['error', 'warn', 'migration'] as LoggerOptions,
        dropSchema: true,
      };
    case 'script':
      // when running function for lambda locally using ts-node
      return {
        entities: ['src/**/*.entity.ts'],
        migrations: ['src/migration/*.ts'],
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
  exports: [TypeOrmModule], // Export TypeOrmModule for other modules to use
})
export class DatabaseModule {}
