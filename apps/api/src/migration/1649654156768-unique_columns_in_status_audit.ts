import { MigrationInterface, QueryRunner } from 'typeorm';

export class uniqueColumnsInStatusAudit1649654156768 implements MigrationInterface {
  name = 'uniqueColumnsInStatusAudit1649654156768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX unique_applicant_status_date_job ON ien_applicant_status_audit (applicant_id, status_id, start_date, job_id) WHERE job_id IS NOT NULL;`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX unique_applicant_status_date ON ien_applicant_status_audit (applicant_id, status_id, start_date) WHERE job_id IS NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX unique_applicant_status_date`);
    await queryRunner.query(`DROP INDEX unique_applicant_status_date_job`);
  }
}
