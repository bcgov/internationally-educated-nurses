import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { DatabaseNamingStrategy } from './database/database.naming-strategy';
import DatabaseLogger from './database/database-logger';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.PORTGRES_PORT || 5432),
  connectTimeoutMS: +(process.env.POSTGRES_TIMEOUT || 30000),
  username: process.env.POSTGRES_USERNAME || 'freshworks',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || 'ien',
  entities: ['dist/**/entity/*.entity.js'],
  migrations: ['dist/migration/*.js'],
  subscribers: ['dist/**/*.subscribers.js'],
  synchronize: false,
  migrationsRun: true,
  namingStrategy: new DatabaseNamingStrategy(),
  logging: !!process.env.DEBUG,
  logger: process.env.DEBUG ? new DatabaseLogger() : undefined,
});