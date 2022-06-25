import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnRevokedAccessDate1655938998605 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employee" ADD COLUMN "revoked_access_date" date DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "revoked_access_date"`);
  }
}
