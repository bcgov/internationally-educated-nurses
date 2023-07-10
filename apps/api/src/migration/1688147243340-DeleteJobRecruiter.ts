import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteJobRecruiter1688147243340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_jobs" DROP COLUMN IF EXISTS "recruiter_name"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_jobs" ADD COLUMN "recruiter_name" character varying 
    `);
  }
}
