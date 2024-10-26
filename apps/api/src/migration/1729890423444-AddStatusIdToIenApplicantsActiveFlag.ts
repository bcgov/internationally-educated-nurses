import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddStatusIdToIenApplicantsActiveFlag1729890423444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the new column 'status_id' to 'ien_applicants_active_flag' table
    await queryRunner.addColumn(
      'ien_applicants_active_flag',
      new TableColumn({
        name: 'status_id',
        type: 'uuid',
        isNullable: true, // Allow null values to support ON DELETE SET NULL
      }),
    );

    // Add foreign key constraint to 'status_id'
    await queryRunner.createForeignKey(
      'ien_applicants_active_flag',
      new TableForeignKey({
        columnNames: ['status_id'],
        referencedTableName: 'ien_applicant_status',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL', // Set to null if the referenced row is deleted
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint first
    const table = await queryRunner.getTable('ien_applicants_active_flag');
    if (!table) {
      return;
    }

    const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('status_id') !== -1);
    if (!foreignKey) {
      return;
    }
    await queryRunner.dropForeignKey('ien_applicants_active_flag', foreignKey);

    // Then drop the 'status_id' column
    await queryRunner.dropColumn('ien_applicants_active_flag', 'status_id');
  }
}
