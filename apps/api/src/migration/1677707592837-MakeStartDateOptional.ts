import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeStartDateOptional1677707592837 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ien_applicant_status_audit ALTER COLUMN start_date DROP NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ien_applicant_status_audit ALTER COLUMN start_date SET NOT NULL;`,
    );
  }
}
