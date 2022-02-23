import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicantAndStatus1645638796025 implements MigrationInterface {
  name = 'ApplicantAndStatus1645638796025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applicant_status" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "parent_id" integer, CONSTRAINT "PK_49d0c6ebdf29583a6ddd71eeaf3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applicants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying, "profession" character varying NOT NULL, "speciality" character varying, "assigned_to" character varying, "ha_pcn" character varying NOT NULL, "first_referral" date, "latest_referral" date, "followed_up" date, "date_matched" date, "comment" character varying, "added_by" character varying, "added_by_id" character varying, "is_open" boolean NOT NULL DEFAULT true, "additional_data" jsonb, "status_id" integer, CONSTRAINT "PK_c02ec3c46124479ce758ca50943" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_status" ADD CONSTRAINT "FK_9c6b04eb8266ec1b08acbf40e29" FOREIGN KEY ("parent_id") REFERENCES "applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicants" ADD CONSTRAINT "FK_d72034c04f46598639b681990bc" FOREIGN KEY ("status_id") REFERENCES "applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applicants" DROP CONSTRAINT "FK_d72034c04f46598639b681990bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_status" DROP CONSTRAINT "FK_9c6b04eb8266ec1b08acbf40e29"`,
    );
    await queryRunner.query(`DROP TABLE "applicants"`);
    await queryRunner.query(`DROP TABLE "applicant_status"`);
  }
}
