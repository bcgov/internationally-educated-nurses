import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class RemoveDuplicateMilestone1699550484811 implements MigrationInterface {
  foreignKey = new TableForeignKey({
    columnNames: ['status_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'ien_applicant_status',
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove duplicate BCCNM Provisional Licence RPN and Signed Return of Service Agreement
    await queryRunner.createForeignKey('ien_applicant_status_audit', this.foreignKey);
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
