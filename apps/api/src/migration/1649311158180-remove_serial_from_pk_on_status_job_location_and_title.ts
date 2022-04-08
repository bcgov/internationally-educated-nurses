import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeSerialFromPkOnStatusJobLocationAndTitle1649311158180
  implements MigrationInterface
{
  name = 'removeSerialFromPkOnStatusJobLocationAndTitle1649311158180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "status_date"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" DROP CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_applicant_status_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_96851b7ead002bc727654629623"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_job_locations" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_job_locations_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_job_titles" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_job_titles_id_seq"`);
    await queryRunner.query(`ALTER TABLE "ien_education" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_education_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" ADD CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f" FOREIGN KEY ("parent_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e" FOREIGN KEY ("job_title_id") REFERENCES "ien_job_titles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_96851b7ead002bc727654629623" FOREIGN KEY ("job_location_id") REFERENCES "ien_job_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_96851b7ead002bc727654629623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" DROP CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_education_id_seq" OWNED BY "ien_education"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_education" ALTER COLUMN "id" SET DEFAULT nextval('"ien_education_id_seq"')`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_job_titles_id_seq" OWNED BY "ien_job_titles"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_job_titles" ALTER COLUMN "id" SET DEFAULT nextval('"ien_job_titles_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e" FOREIGN KEY ("job_title_id") REFERENCES "ien_job_titles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_job_locations_id_seq" OWNED BY "ien_job_locations"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_job_locations" ALTER COLUMN "id" SET DEFAULT nextval('"ien_job_locations_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_96851b7ead002bc727654629623" FOREIGN KEY ("job_location_id") REFERENCES "ien_job_locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_applicant_status_id_seq" OWNED BY "ien_applicant_status"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" ALTER COLUMN "id" SET DEFAULT nextval('"ien_applicant_status_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" ADD CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f" FOREIGN KEY ("parent_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "status_date" date`);
  }
}
