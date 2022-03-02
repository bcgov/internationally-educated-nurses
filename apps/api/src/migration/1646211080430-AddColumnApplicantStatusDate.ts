import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnApplicantStatusDate1646211080430 implements MigrationInterface {
  name = 'AddColumnApplicantStatusDate1646211080430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicants" ADD "status_date" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "applicants" DROP COLUMN "status_date"`);
  }
}
