import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENApplicantAuditANDMasterTables1646722375696 implements MigrationInterface {
  name = 'IENApplicantAuditANDMasterTables1646722375696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ien_applicant_status" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "parent_id" integer, CONSTRAINT "PK_372b83d248cf5c18487a63ade61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_ha_pcn" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_aefc07c3233373fc771f60c43ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "user_id" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9b4c452677299d3199762f8a4d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6dce5313d82a7d8f5208cc005d" ON "ien_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicant_status_audit" ("id" SERIAL NOT NULL, "start_date" date NOT NULL, "end_date" date, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "status_id" integer, "ha_pcn_id" integer, "applicant_id" uuid, "added_by_id" integer, "updated_by_id" integer, CONSTRAINT "PK_da37e46c4475ec772047add45a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "applicant_id" character varying, "email" character varying, "citizenship" character varying, "country_of_training" character varying, "pr_of_canada" boolean NOT NULL DEFAULT false, "education" character varying, "registration_date" date, "additional_data" jsonb, "status_date" date, "is_open" boolean NOT NULL DEFAULT true, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "status_id" integer, "added_by_id" integer, "updated_by_id" integer, CONSTRAINT "PK_4360f78a2a66a5773ebec6bd4a3" PRIMARY KEY ("id")); COMMENT ON COLUMN "ien_applicants"."applicant_id" IS 'HMBC ATS system unique ID'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6b47e3f00c32181babece3cbc7" ON "ien_applicants" ("applicant_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicant_audit" ("id" SERIAL NOT NULL, "data" json, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "applicant_id" uuid, "added_by_id" integer, CONSTRAINT "PK_18e78d0279d225e8f5aa9ab08d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_education" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_41a19cbcfc56b0b83b94e13be21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicants_ha_pcn_ien_ha_pcn" ("ien_applicants_id" uuid NOT NULL, "ien_ha_pcn_id" integer NOT NULL, CONSTRAINT "PK_ebf9db6b293bf23cf789947e5a5" PRIMARY KEY ("ien_applicants_id", "ien_ha_pcn_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44ae5adc020528e8950d302c2a" ON "ien_applicants_ha_pcn_ien_ha_pcn" ("ien_applicants_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b043fcc9ccc6814d3a908fa78" ON "ien_applicants_ha_pcn_ien_ha_pcn" ("ien_ha_pcn_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ien_applicants_assigned_to_ien_users" ("ien_applicants_id" uuid NOT NULL, "ien_users_id" integer NOT NULL, CONSTRAINT "PK_6110438dd9f0ffb721987522314" PRIMARY KEY ("ien_applicants_id", "ien_users_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_414fa1213df3ef2936f822091f" ON "ien_applicants_assigned_to_ien_users" ("ien_applicants_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23d13e2efee75e1052a6035c05" ON "ien_applicants_assigned_to_ien_users" ("ien_users_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" ADD CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f" FOREIGN KEY ("parent_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_d5f94a9f4893dda53f2a246cdd8" FOREIGN KEY ("ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_e62fadef6ff5dbd02550986b62b" FOREIGN KEY ("applicant_id") REFERENCES "ien_applicants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_becd1676646cc26709b94857480" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" ADD CONSTRAINT "FK_5fb15fc5f59186b70598a7d2b0c" FOREIGN KEY ("applicant_id") REFERENCES "ien_applicants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" ADD CONSTRAINT "FK_9cbc7668841069140beafa286a7" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" ADD CONSTRAINT "FK_44ae5adc020528e8950d302c2a5" FOREIGN KEY ("ien_applicants_id") REFERENCES "ien_applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" ADD CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a" FOREIGN KEY ("ien_ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" ADD CONSTRAINT "FK_414fa1213df3ef2936f822091f2" FOREIGN KEY ("ien_applicants_id") REFERENCES "ien_applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" ADD CONSTRAINT "FK_23d13e2efee75e1052a6035c053" FOREIGN KEY ("ien_users_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" DROP CONSTRAINT "FK_23d13e2efee75e1052a6035c053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" DROP CONSTRAINT "FK_414fa1213df3ef2936f822091f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" DROP CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" DROP CONSTRAINT "FK_44ae5adc020528e8950d302c2a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" DROP CONSTRAINT "FK_9cbc7668841069140beafa286a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" DROP CONSTRAINT "FK_5fb15fc5f59186b70598a7d2b0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_becd1676646cc26709b94857480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_e62fadef6ff5dbd02550986b62b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d5f94a9f4893dda53f2a246cdd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" DROP CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_23d13e2efee75e1052a6035c05"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_414fa1213df3ef2936f822091f"`);
    await queryRunner.query(`DROP TABLE "ien_applicants_assigned_to_ien_users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9b043fcc9ccc6814d3a908fa78"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_44ae5adc020528e8950d302c2a"`);
    await queryRunner.query(`DROP TABLE "ien_applicants_ha_pcn_ien_ha_pcn"`);
    await queryRunner.query(`DROP TABLE "ien_education"`);
    await queryRunner.query(`DROP TABLE "ien_applicant_audit"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6b47e3f00c32181babece3cbc7"`);
    await queryRunner.query(`DROP TABLE "ien_applicants"`);
    await queryRunner.query(`DROP TABLE "ien_applicant_status_audit"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_6dce5313d82a7d8f5208cc005d"`);
    await queryRunner.query(`DROP TABLE "ien_users"`);
    await queryRunner.query(`DROP TABLE "ien_ha_pcn"`);
    await queryRunner.query(`DROP TABLE "ien_applicant_status"`);
  }
}
