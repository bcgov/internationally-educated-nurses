import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicantActiveFlagTable1688588472695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('ien_applicants_active_flag');
    if (!tableExists) {
      await queryRunner.query(`
        CREATE TABLE "ien_applicants_active_flag" (
          applicant_id uuid,
          ha_id uuid,
          is_active boolean,
          PRIMARY KEY("applicant_id", "ha_id"),
          FOREIGN KEY("applicant_id") REFERENCES "ien_applicants"("id") ON DELETE CASCADE,
          FOREIGN KEY("ha_id") REFERENCES "ien_ha_pcn"("id") ON DELETE CASCADE
        )
      `);

      await queryRunner.query(`
        INSERT INTO "ien_applicants_active_flag" (applicant_id, ha_id, is_active)
          SELECT DISTINCT iasa.applicant_id, ihp.id, true
          FROM "ien_applicant_status_audit" AS iasa
          LEFT JOIN "ien_applicant_status" AS ias ON iasa.status_id = ias.id
          LEFT JOIN "ien_ha_pcn" AS ihp ON ias.status ILIKE 'Applicant Referred To%'
          WHERE ihp.abbreviation = TRIM(LEADING 'Applicant Referred To' FROM ias.status)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "ien_applicants_active_flag"
    `);
  }
}
