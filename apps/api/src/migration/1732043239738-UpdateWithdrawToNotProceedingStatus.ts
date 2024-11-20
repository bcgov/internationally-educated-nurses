import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWithdrawToNotProceedingStatus1732043239738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "ien_applicant_status"
      SET "status" = 'Not proceeding'
      WHERE "status" = 'Withdrew from IEN program'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "ien_applicant_status"
      SET "status" = 'Withdrew from IEN program'
      WHERE "status" = 'Not proceeding'
    `);
  }
}
