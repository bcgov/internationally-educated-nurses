import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUUIDtoJob1660929515982 implements MigrationInterface {
  name = 'AddUUIDtoJob1660929515982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ien_applicant_jobs ADD COLUMN "uid" uuid DEFAULT uuid_generate_v4();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ien_applicant_jobs DROP COLUMN "uid";
    `);
  }
}
