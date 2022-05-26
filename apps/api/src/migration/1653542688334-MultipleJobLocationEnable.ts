import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultipleJobLocationEnable1653542688334 implements MigrationInterface {
  name = 'MultipleJobLocationEnable1653542688334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_96851b7ead002bc727654629623"`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicant_jobs_job_location_ien_job_locations" ("ien_applicant_jobs_id" integer NOT NULL, "ien_job_locations_id" integer NOT NULL, CONSTRAINT "PK_91617a5ac17b33020b9802273b5" PRIMARY KEY ("ien_applicant_jobs_id", "ien_job_locations_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4e8a99227d12fd8e7988b7d5b8" ON "ien_applicant_jobs_job_location_ien_job_locations" ("ien_applicant_jobs_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49234a6721d32bb0177de42015" ON "ien_applicant_jobs_job_location_ien_job_locations" ("ien_job_locations_id") `,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" DROP COLUMN "job_location_id"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs_job_location_ien_job_locations" ADD CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88" FOREIGN KEY ("ien_applicant_jobs_id") REFERENCES "ien_applicant_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs_job_location_ien_job_locations" ADD CONSTRAINT "FK_49234a6721d32bb0177de420153" FOREIGN KEY ("ien_job_locations_id") REFERENCES "ien_job_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs_job_location_ien_job_locations" DROP CONSTRAINT "FK_49234a6721d32bb0177de420153"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs_job_location_ien_job_locations" DROP CONSTRAINT "FK_4e8a99227d12fd8e7988b7d5b88"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" ADD "job_location_id" integer`);
    await queryRunner.query(`DROP INDEX "public"."IDX_49234a6721d32bb0177de42015"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4e8a99227d12fd8e7988b7d5b8"`);
    await queryRunner.query(`DROP TABLE "ien_applicant_jobs_job_location_ien_job_locations"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_96851b7ead002bc727654629623" FOREIGN KEY ("job_location_id") REFERENCES "ien_job_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
