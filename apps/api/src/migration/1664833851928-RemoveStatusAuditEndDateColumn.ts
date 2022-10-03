import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveStatusAuditEndDateColumn1664833851928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit" DROP COLUMN IF EXISTS "end_date";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit" ADD COLUMN IF NOT EXISTS "end_date" date;
    `);
  }
}
