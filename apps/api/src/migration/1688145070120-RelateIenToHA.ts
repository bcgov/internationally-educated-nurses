import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelateIenToHA1688145070120 implements MigrationInterface {
  tableName = 'ien_applicants_recruiters_employee';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "${this.tableName}" (
        applicant_id uuid,
        ha_id uuid,
        employee_id uuid,
        PRIMARY KEY("applicant_id", "ha_id"),
        FOREIGN KEY("applicant_id") REFERENCES "ien_applicants"("id") ON DELETE CASCADE,
        FOREIGN KEY("ha_id") REFERENCES "ien_ha_pcn"("id") ON DELETE CASCADE,
        FOREIGN KEY("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE
      );
      DROP TABLE IF EXISTS "ien_applicants_assignments_employee";
      DROP TABLE IF EXISTS "ien_applicants_assignments_employee";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "${this.tableName}"
    `);
  }
}
