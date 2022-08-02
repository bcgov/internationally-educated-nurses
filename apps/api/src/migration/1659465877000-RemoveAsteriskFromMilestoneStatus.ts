import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAsteriskFromMilestoneStatus1659465877000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE ien_applicant_status
      SET status = TRANSLATE(status, '*', '')
      WHERE status LIKE '%*';
    `);
  }

  public async down(): Promise<void> {
    /* No need to restore asterisks */
  }
}
