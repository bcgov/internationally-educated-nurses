import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENApplicantJob1647409256825 implements MigrationInterface {
  name = 'IENApplicantJob1647409256825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ien_job_locations" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_a4ac2d776b4184b5bcf40429f02" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_job_titles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_c874b81ab3d65008a9ec1a03431" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicant_jobs" ("id" SERIAL NOT NULL, "job_id" character varying, "recruiter_name" character varying, "job_post_date" date, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "ha_pcn_id" integer, "job_title_id" integer, "job_location_id" integer, "added_by_id" integer, "applicant_id" uuid, CONSTRAINT "PK_31efc588c0c68ba5a7e50662c28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239" FOREIGN KEY ("ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e" FOREIGN KEY ("job_title_id") REFERENCES "ien_job_titles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_96851b7ead002bc727654629623" FOREIGN KEY ("job_location_id") REFERENCES "ien_job_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_198577703f11162d6294837d3a7" FOREIGN KEY ("applicant_id") REFERENCES "ien_applicants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_198577703f11162d6294837d3a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_96851b7ead002bc727654629623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239"`,
    );
    await queryRunner.query(`DROP TABLE "ien_applicant_jobs"`);
    await queryRunner.query(`DROP TABLE "ien_job_titles"`);
    await queryRunner.query(`DROP TABLE "ien_job_locations"`);
  }
}
