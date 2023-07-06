import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveActiveInactiveFlagFromApplicantsTable1688588977245
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN IF EXISTS "is_active"`);
  }

  public async down(): Promise<void> {
    //no need to reverse, moving column to another table
  }
}
