import { MigrationInterface, QueryRunner } from 'typeorm';

export class applicantStatusAudit1645810577547 implements MigrationInterface {
  name = 'applicantStatusAudit1645810577547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applicant_status_audit" ("id" SERIAL NOT NULL, "start_date" date NOT NULL, "end_date" date, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "added_by" character varying, "added_by_id" character varying, "updated_by" character varying, "updated_by_id" character varying, "status_id" integer, "applicant_id" uuid, CONSTRAINT "PK_a04f385fef32f17b4cda83fff7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_status_audit" ADD CONSTRAINT "FK_127ebd6d2466fe6b6abad48cffa" FOREIGN KEY ("status_id") REFERENCES "applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_status_audit" ADD CONSTRAINT "FK_86ff59a300c0c81cf21d83db7bf" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applicant_status_audit" DROP CONSTRAINT "FK_86ff59a300c0c81cf21d83db7bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_status_audit" DROP CONSTRAINT "FK_127ebd6d2466fe6b6abad48cffa"`,
    );
    await queryRunner.query(`DROP TABLE "applicant_status_audit"`);
  }
}
