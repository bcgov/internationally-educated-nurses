import { MigrationInterface, QueryRunner } from 'typeorm';

export class modifyIenApplicantTable1649137089843 implements MigrationInterface {
  name = 'modifyIenApplicantTable1649137089843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "pr_of_canada"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "citizenship"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "country_of_training"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "education"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "email_address" character varying`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "phone_number" character varying`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "assigned_to" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "country_of_citizenship" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "country_of_residence" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "pr_status" character varying`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "nursing_educations" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "bccnm_license_number" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "health_authorities" jsonb`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "notes" jsonb`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6b47e3f00c32181babece3cbc7"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "applicant_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "applicant_id" bigint`);
    await queryRunner.query(
      `COMMENT ON COLUMN "ien_applicants"."applicant_id" IS 'HMBC ATS system unique ID'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6b47e3f00c32181babece3cbc7" ON "ien_applicants" ("applicant_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_6b47e3f00c32181babece3cbc7"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "ien_applicants"."applicant_id" IS 'HMBC ATS system unique ID'`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "applicant_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "applicant_id" character varying`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6b47e3f00c32181babece3cbc7" ON "ien_applicants" ("applicant_id") `,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "notes"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "health_authorities"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "bccnm_license_number"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "nursing_educations"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "pr_status"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "country_of_residence"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "country_of_citizenship"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "assigned_to"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "phone_number"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "email_address"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "education" character varying`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "country_of_training" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "citizenship" character varying`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "email" character varying`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD "pr_of_canada" boolean NOT NULL DEFAULT false`,
    );
  }
}
