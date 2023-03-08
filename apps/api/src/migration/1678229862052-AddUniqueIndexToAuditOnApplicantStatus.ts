import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToAuditOnApplicantStatus1678229862052 implements MigrationInterface {
  indexName = 'unique_applicant_status_null_date';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // remove duplicate milestones without start_date
    await queryRunner.query(`
      DELETE FROM ien_applicant_status_audit a
        USING ien_applicant_status_audit b
      WHERE a.id < b.id AND 
        a.start_date IS NULL AND
        b.start_date IS NULL AND 
        a.status_id = b.status_id AND
        a.applicant_id = b.applicant_id;
    `);

    // add index to prevent the same milestone without start_date for an applicant
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "${this.indexName}"
      ON public.ien_applicant_status_audit (applicant_id, status_id)
      WHERE (start_date IS NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF exists "${this.indexName}" ;
    `);
  }
}
