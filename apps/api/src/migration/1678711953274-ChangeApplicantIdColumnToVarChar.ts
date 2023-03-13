import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeApplicantIdColumnToVarChar1678711953274 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "applicant_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "ats1_id" varchar UNIQUE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "ats1_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "applicant_id" uuid`);
  }
}
