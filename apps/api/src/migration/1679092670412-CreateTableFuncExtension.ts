import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableFuncExtension1679092670412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tablefunc extension is required to use crosstab function
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "tablefunc"');
    await queryRunner.query('DROP VIEW IF EXISTS "milestone_duration"');
    await queryRunner.query('DROP VIEW IF EXISTS "hired_applicant_milestone"');
    await queryRunner.query('DROP VIEW IF EXISTS "hired_applicant"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS "tablefunc" CASCADE');
  }
}
