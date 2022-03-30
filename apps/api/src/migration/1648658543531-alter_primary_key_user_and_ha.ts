import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterPrimaryKeyUserAndHa1648658543531 implements MigrationInterface {
  name = 'alterPrimaryKeyUserAndHa1648658543531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" DROP CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_ha_pcn" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_ha_pcn_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" DROP CONSTRAINT "FK_9cbc7668841069140beafa286a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_becd1676646cc26709b94857480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" DROP CONSTRAINT "FK_23d13e2efee75e1052a6035c053"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_users" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_users_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239" FOREIGN KEY ("ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_becd1676646cc26709b94857480" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" ADD CONSTRAINT "FK_9cbc7668841069140beafa286a7" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" ADD CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a" FOREIGN KEY ("ien_ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" DROP CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" DROP CONSTRAINT "FK_9cbc7668841069140beafa286a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_becd1676646cc26709b94857480"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_users_id_seq" OWNED BY "ien_users"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_users" ALTER COLUMN "id" SET DEFAULT nextval('"ien_users_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_assigned_to_ien_users" ADD CONSTRAINT "FK_23d13e2efee75e1052a6035c053" FOREIGN KEY ("ien_users_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_becd1676646cc26709b94857480" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" ADD CONSTRAINT "FK_9cbc7668841069140beafa286a7" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_ha_pcn_id_seq" OWNED BY "ien_ha_pcn"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_ha_pcn" ALTER COLUMN "id" SET DEFAULT nextval('"ien_ha_pcn_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_d5cad295b21c8c1ffee10d9a239" FOREIGN KEY ("ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants_ha_pcn_ien_ha_pcn" ADD CONSTRAINT "FK_9b043fcc9ccc6814d3a908fa78a" FOREIGN KEY ("ien_ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
