import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.providers';

@Module({
  imports: [TypeOrmModule.forRoot(databaseProviders)],
  providers: [Logger],
})
export class DatabaseModule {}
