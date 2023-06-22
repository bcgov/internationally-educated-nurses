import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRpnIenType1687455605581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TYPE ien_type ADD VALUE IF NOT EXISTS 'RPN' AFTER 'RN';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // can't remove enum value
    await queryRunner.query(`
      ALTER TYPE ien_type RENAME TO ien_type_old;
      CREATE TYPE ien_type AS ENUM ('HCA', 'LPN', 'RN');
      ALTER TABLE "ien_applicant_status_audit" ALTER COLUMN "type" TYPE ien_type using type::text::ien_type;
      DROP TYPE ien_type_old;
    `);
  }
}
