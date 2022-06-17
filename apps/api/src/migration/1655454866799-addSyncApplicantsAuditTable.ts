import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSyncApplicantsAuditTable1655454866799 implements MigrationInterface {
  name = 'addSyncApplicantsAuditTable1655454866799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "sync_applicants_audit" ("id" SERIAL NOT NULL, "is_success" boolean NOT NULL DEFAULT false, "additional_data" jsonb, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ab238a7532fc968f5517207f96" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sync_applicants_audit"`);
  }
}
