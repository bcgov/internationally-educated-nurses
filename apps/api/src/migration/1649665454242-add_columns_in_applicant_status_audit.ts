import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnsInApplicantStatusAudit1649665454242 implements MigrationInterface {
  name = 'addColumnsInApplicantStatusAudit1649665454242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD "reason_other" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "effective_date" date`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "reason_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_045238bdd7d46415bcb9a4b9372" FOREIGN KEY ("reason_id") REFERENCES "ien_status_reasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_045238bdd7d46415bcb9a4b9372"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "reason_id"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "effective_date"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "reason_other"`);
  }
}
