import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnInHAPCN1648619359354 implements MigrationInterface {
  name = 'AddColumnInHAPCN1648619359354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_ha_pcn" ADD "abbreviation" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_ha_pcn" DROP COLUMN "abbreviation"`);
  }
}
