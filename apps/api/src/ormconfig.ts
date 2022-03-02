import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseNamingStrategy } from './database/database.naming-strategy';
dotenv.config();
// Check typeORM documentation for more information.

const config: PostgresConnectionOptions = {
  host: process.env.POSTGRES_HOST,
  type: 'postgres',
  port: 5432,
  connectTimeoutMS: 5000,
  username: process.env.POSTGRES_USERNAME || 'freshworks',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'ien',
  cli: {
    migrationsDir: 'src/migration',
    entitiesDir: 'src/**/entity/*.entity.ts',
  },
  subscribers: ['dist/**/*.subscribers.js'],
  synchronize: false,
  migrationsRun: true,
  namingStrategy: new DatabaseNamingStrategy(),
  logging: true,
};
export default config;
