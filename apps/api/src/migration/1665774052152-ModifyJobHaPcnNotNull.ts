import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyJobHaPcnNotNull1665774052152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_jobs" ALTER COLUMN "ha_pcn_id" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_jobs" ALTER COLUMN "ha_pcn_id" DROP NOT NULL;
    `);
  }
}
