import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENStatusAuditAddColumnNotes1647441713709 implements MigrationInterface {
  name = 'IENStatusAuditAddColumnNotes1647441713709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD "notes" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "notes"`);
  }
}
