import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteColumnJobAccepted1661547965768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicants" DROP COLUMN "job_accepted";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicants" ADD COLUMN "job_accepted" INT
      CONSTRAINT "ien_applicants_ien_applicant_job_fk_job_accepted" REFERENCES "ien_applicant_jobs" ("id")
      ON UPDATE CASCADE ON DELETE CASCADE;
    `);
  }
}
