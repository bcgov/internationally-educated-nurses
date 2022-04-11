import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnInApplicantStatus1649659694208 implements MigrationInterface {
  name = 'addColumnInApplicantStatus1649659694208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status" ADD "party" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status" DROP COLUMN "party"`);
  }
}
