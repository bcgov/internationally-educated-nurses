import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddHistoryTable1695402634183 implements MigrationInterface {
  tableName = 'ien_applicant_status_audit';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName);
    if (table) {
      const column = table?.findColumnByName('deleted_date');
      if (!column) {
        await queryRunner.addColumn(
          'ien_applicant_status_audit',
          new TableColumn({
            name: 'deleted_date',
            type: 'timestamp',
            isNullable: true,
          }),
        );
      }
    }

    await queryRunner.createTable(
      new Table({
        name: 'milestone_audit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'table',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'field',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'record_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'old_value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'new_value',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_date',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ien_applicant_status_audit', 'deleted_date');
    await queryRunner.dropTable('audit');
  }
}
