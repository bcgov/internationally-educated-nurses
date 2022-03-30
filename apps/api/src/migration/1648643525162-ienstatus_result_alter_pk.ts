import { MigrationInterface, QueryRunner } from 'typeorm';

export class ienstatusResultAlterPk1648643525162 implements MigrationInterface {
  name = 'ienstatusResultAlterPk1648643525162';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_status_reasons" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`DROP SEQUENCE "ien_status_reasons_id_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "ien_status_reasons_id_seq" OWNED BY "ien_status_reasons"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_status_reasons" ALTER COLUMN "id" SET DEFAULT nextval('"ien_status_reasons_id_seq"')`,
    );
  }
}
