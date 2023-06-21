import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIenType1686775711924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE ien_type AS ENUM ('HCA', 'LPN', 'RN')
    `);
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit" ADD COLUMN IF NOT EXISTS "type" ien_type DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "type"
    `);
  }
}
