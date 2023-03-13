import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicantIdFkToStatusAudit1678729486448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit"
      ADD CONSTRAINT "fk_status_audit_applicant_id"
      FOREIGN KEY ("applicant_id")
      REFERENCES "ien_applicants"("id") ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit"
      DROP CONSTRAINT IF EXISTS "fk_status_audit_applicant_id"
    `);
  }
}
