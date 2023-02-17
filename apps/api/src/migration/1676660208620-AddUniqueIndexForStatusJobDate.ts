import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexForStatusJobDate1676660208620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // for some reason the test env did not create this unique index,
    // writing a small migration just incase it happens in the future
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "unique_applicant_status_date_job"
      ON "ien_applicant_status_audit" (applicant_id, status_id, start_date, job_id)
      WHERE job_id IS NOT NULL
    `);
  }

  public async down(): Promise<void> {
    // no rollback
  }
}
