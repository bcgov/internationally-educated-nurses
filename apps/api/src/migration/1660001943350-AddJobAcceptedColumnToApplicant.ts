import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobAcceptedColumnToApplicant1660001943350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicants" ADD COLUMN "job_accepted" INT
      CONSTRAINT "ien_applicants_ien_applicant_job_fk_job_accepted" REFERENCES "ien_applicant_jobs" ("id")
      ON UPDATE CASCADE ON DELETE SET NULL;
      
      UPDATE "ien_applicants" ia SET job_accepted = (
        SELECT iasa."job_id" FROM "ien_applicant_status_audit" iasa
        WHERE ia.id = iasa."applicant_id" AND iasa."status_id" = 308
        ORDER BY iasa."start_date" DESC 
        LIMIT 1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicants" DROP COLUMN "job_accepted";
    `);
  }
}
