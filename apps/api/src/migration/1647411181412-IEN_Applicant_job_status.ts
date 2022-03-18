import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENApplicantJobStatus1647411181412 implements MigrationInterface {
  name = 'IENApplicantJobStatus1647411181412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "job_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_ec2940cc497a06ba811763be464" FOREIGN KEY ("job_id") REFERENCES "ien_applicant_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_ec2940cc497a06ba811763be464"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "job_id"`);
  }
}
