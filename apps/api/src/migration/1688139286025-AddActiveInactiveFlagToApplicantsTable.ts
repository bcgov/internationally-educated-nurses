import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveInactiveFlagToApplicantsTable1688139286025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "ien_applicants" ADD COLUMN "is_active" boolean DEFAULT true',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN "is_active"`);
  }
}
