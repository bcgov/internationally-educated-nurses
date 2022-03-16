import { MigrationInterface, QueryRunner } from 'typeorm';

export class IENRemoveHaFromStatusAudit1647412472348 implements MigrationInterface {
  name = 'IENRemoveHaFromStatusAudit1647412472348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT "FK_d5f94a9f4893dda53f2a246cdd8"`,
    );
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" DROP COLUMN "ha_pcn_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_applicant_status_audit" ADD "ha_pcn_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_d5f94a9f4893dda53f2a246cdd8" FOREIGN KEY ("ha_pcn_id") REFERENCES "ien_ha_pcn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
