import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertUserIdIntegerToUUID1656487114336 implements MigrationInterface {
  name = 'ConvertUserIdIntegerToUUID1656487114336';

  public async up(queryRunner: QueryRunner): Promise<void> {

     /*temp index removed */
     await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2"`);
     await queryRunner.query(`ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_becd1676646cc26709b94857480"`);
     await queryRunner.query(`ALTER TABLE "ien_applicants_assigned_to_ien_users" DROP CONSTRAINT "FK_23d13e2efee75e1052a6035c053"`);
     /* temp index removed */

    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" DROP CONSTRAINT "FK_9cbc7668841069140beafa286a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4"`,
    );

    await queryRunner.query(
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_users" DROP CONSTRAINT "PK_9b4c452677299d3199762f8a4d8"`,
    );

   

    /*temp query to re-map existing user relation*/
    await queryRunner.query(`UPDATE "ien_users" SET user_id = id`);
    /*end temp query*/

    await queryRunner.query(`ALTER TABLE "ien_users" DROP COLUMN "id" CASCADE`);
    await queryRunner.query(
      `ALTER TABLE "ien_users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_users" ADD CONSTRAINT "PK_9b4c452677299d3199762f8a4d8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" ADD "added_by_id" uuid`);

    /*temp query to re-map existing user relation by adding temp column*/
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD "added_by_id_temp" character varying`,
    );
    await queryRunner.query(
      `UPDATE "ien_applicant_status_audit" SET "added_by_id_temp" = "added_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD "updated_by_id_temp" character varying`,
    );
    await queryRunner.query(
      `UPDATE "ien_applicant_status_audit" SET "updated_by_id_temp" = "updated_by_id"`,
    );
    /*end temp query*/

    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "added_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "updated_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "updated_by_id" uuid`);

    /*temp query to re-map existing user relation to update it with new one & drop temp columns*/
    await queryRunner.query(
      `UPDATE "ien_applicant_status_audit" SET added_by_id = ien_users.id FROM "ien_users" WHERE ien_applicant_status_audit.added_by_id_temp = ien_users.user_id`,
    );
    await queryRunner.query(
      `UPDATE "ien_applicant_status_audit" SET updated_by_id = ien_users.id FROM "ien_users" WHERE ien_applicant_status_audit.updated_by_id_temp = ien_users.user_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "added_by_id_temp"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "updated_by_id_temp"`,
    );
    /*end temp query*/

    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "added_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "updated_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "updated_by_id" uuid`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_audit" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_audit" ADD "added_by_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_d38dff64ad3a6ab12b67dc706a2" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`ALTER TABLE "ien_applicant_audit" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_audit" ADD "added_by_id" integer`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "updated_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "updated_by_id" integer`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "added_by_id" integer`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "updated_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "updated_by_id" integer`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "added_by_id" integer`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" DROP COLUMN "added_by_id"`);
    await queryRunner.query(`ALTER TABLE "ien_applicant_jobs" ADD "added_by_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "ien_users" DROP CONSTRAINT "PK_9b4c452677299d3199762f8a4d8"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "ien_users" ADD "id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "ien_users" ADD CONSTRAINT "PK_9b4c452677299d3199762f8a4d8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_b606447f3cbb4b8c5356011d58a" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_jobs" ADD CONSTRAINT "FK_30c12dea0e069e5162a3fdbbad4" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_95f8434de7036d2dbd1e71ff901" FOREIGN KEY ("updated_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_audit" ADD CONSTRAINT "FK_9cbc7668841069140beafa286a7" FOREIGN KEY ("added_by_id") REFERENCES "ien_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
