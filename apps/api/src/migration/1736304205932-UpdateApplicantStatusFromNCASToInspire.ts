import { NCAS_NEW_NAME } from '@ien/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateApplicantStatusFromNCASToInspire1736304205932 implements MigrationInterface {
  // Define constants for clarity
  private readonly OLD_VALUE = 'NCAS';
  private readonly NEW_VALUE = NCAS_NEW_NAME;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update specific status values
    await queryRunner.query(`
            UPDATE ien_applicant_status
            SET status = CASE
                WHEN status = 'Referred to ${this.OLD_VALUE}' THEN 'Referred to ${this.NEW_VALUE}'
                WHEN status = 'Applied to ${this.OLD_VALUE}' THEN 'Applied to ${this.NEW_VALUE}'
                WHEN status = 'Completed ${this.OLD_VALUE}' THEN 'Completed ${this.NEW_VALUE}'
                ELSE status
            END
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert specific status values back to NCAS
    await queryRunner.query(`
            UPDATE ien_applicant_status
            SET status = CASE
                WHEN status = 'Referred to ${this.NEW_VALUE}' THEN 'Referred to ${this.OLD_VALUE}'
                WHEN status = 'Applied to ${this.NEW_VALUE}' THEN 'Applied to ${this.OLD_VALUE}'
                WHEN status = 'Completed ${this.NEW_VALUE}' THEN 'Completed ${this.OLD_VALUE}'
                ELSE status
            END
        `);
  }
}
