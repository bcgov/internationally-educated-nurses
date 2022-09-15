import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUnusedStatusColumns1663118591667 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = 'ien_applicant_status';
    await queryRunner.query(`
      ALTER TABLE "${table}" DROP COLUMN IF EXISTS "parent_id";
      ALTER TABLE "${table}" DROP COLUMN IF EXISTS "full_name";
      ALTER TABLE "${table}" DROP COLUMN IF EXISTS "applicant_id";
      ALTER TABLE "${table}" DROP COLUMN IF EXISTS "party";
      ALTER TABLE "${table}" ADD COLUMN "process-related" bool DEFAULT false;
      UPDATE "${table}" SET "process-related" = true
      WHERE status IN(
        'Applicant Referred to FNHA',
        'Applicant Referred to FHA',
        'Applicant Referred to IHA',
        'Applicant Referred to NHA',
        'Applicant Referred to PHC',
        'Applicant Referred to PHSA',
        'Applicant Referred to VCHA',
        'Applicant Referred to VIHA',
        'Withdrew from IEN program'
      )
    `);

    // restore missing unique constraint
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS unique_applicant_status_date ON ien_applicant_status_audit (applicant_id, status_id, start_date) WHERE job_id IS NULL;`,
    );
  }

  public async down(): Promise<void> {
    /* no rollback */
  }
}
