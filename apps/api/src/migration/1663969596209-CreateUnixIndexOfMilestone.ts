import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUnixIndexOfMilestone1663969596209 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX "unique_applicant_status_date"
      ON "ien_applicant_status_audit" (applicant_id, status_id, start_date)
      WHERE job_id IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "unique_applicant_status_date"`);
  }
}
