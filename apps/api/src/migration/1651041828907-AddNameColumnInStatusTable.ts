import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameColumnInStatusTable1651041828907 implements MigrationInterface {
  name = 'AddNameColumnInStatusTable1651041828907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status" ADD "full_name" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status" DROP COLUMN "full_name"`);
  }
}
