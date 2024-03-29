import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOldUnusedTables1676577091787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS form;
      DROP TABLE IF EXISTS submission;
      DROP TABLE IF EXISTS applicant_status CASCADE;
      DROP TABLE IF EXISTS applicants CASCADE;
      DROP TABLE IF EXISTS applicant_status_audit CASCADE;
      DROP TABLE IF EXISTS applicant_audit CASCADE;
    `);
  }

  public async down(): Promise<void> {
    // no rollback with this migration
  }
}
