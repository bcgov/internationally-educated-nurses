import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class RemoveDuplicateMilestone1699550484811 implements MigrationInterface {
  foreignKey = new TableForeignKey({
    columnNames: ['status_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'ien_applicant_status',
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get a list of all constraints on the ien_applicant_status table
    const constraints: Array<{
      column_name: string;
      foreign_table_name: string;
      foreign_column_name: string;
    }> = await queryRunner.query(`
        SELECT
            tc.table_schema, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema='public'
            AND tc.table_name='ien_applicant_status_audit';
    `);
    // Check to see if the the foreign key already exists
    if (
      !constraints.find(
        constraint =>
          constraint.column_name === 'status_id' &&
          constraint.foreign_table_name === 'ien_applicant_status' &&
          constraint.foreign_column_name === 'id',
      )
    ) {
      await queryRunner.createForeignKey('ien_applicant_status_audit', this.foreignKey);
    }
    // Remove duplicate BCCNM Provisional Licence RPN and Signed Return of Service Agreement
    await queryRunner.query(`
      UPDATE ien_applicant_status_audit 
      SET status_id = 'c29bb4d6-b3ad-4fd2-a7dc-2e7d53b35139' 
      WHERE status_id = 'f5456a65-0e55-6957-212e-3a0cadcc796f';
    `);
    await queryRunner.query(`
      UPDATE ien_applicants 
      SET status_id = 'c29bb4d6-b3ad-4fd2-a7dc-2e7d53b35139' 
      WHERE status_id = 'f5456a65-0e55-6957-212e-3a0cadcc796f';
    `);
    await queryRunner.query(`
      UPDATE ien_applicant_status_audit 
      SET status_id = '764374cf-195d-4e40-92ef-6a1e7ada178b' 
      WHERE status_id = 'e05ede97-c316-e956-be21-3a0cadc3015e';
    `);
    await queryRunner.query(`
      UPDATE ien_applicants 
      SET status_id = '764374cf-195d-4e40-92ef-6a1e7ada178b' 
      WHERE status_id = 'e05ede97-c316-e956-be21-3a0cadc3015e';
    `);
    await queryRunner.query(`
      DELETE FROM ien_applicant_status WHERE id IN 
      ('f5456a65-0e55-6957-212e-3a0cadcc796f', 'e05ede97-c316-e956-be21-3a0cadc3015e');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('ien_applicant_status_audit', this.foreignKey);
  }
}
