import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicantAudit1646024716031 implements MigrationInterface {
  name = 'ApplicantAudit1646024716031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "applicant_audit" ("id" SERIAL NOT NULL, "data" json, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "added_by" character varying, "added_by_id" character varying, "applicant_id" uuid, CONSTRAINT "PK_583067b32acf7423ce9e8fb4493" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "applicant_audit" ADD CONSTRAINT "FK_0e91f67c33ddaff06786b8c6069" FOREIGN KEY ("applicant_id") REFERENCES "applicants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "applicant_audit" DROP CONSTRAINT "FK_0e91f67c33ddaff06786b8c6069"`,
    );
    await queryRunner.query(`DROP TABLE "applicant_audit"`);
  }
}
