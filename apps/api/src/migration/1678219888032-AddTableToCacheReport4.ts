import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddTableToCacheReport41678219888032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'report_cache',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'report_number',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'report_period',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'report_data',
            type: 'jsonb',
          },
          {
            name: 'created_date',
            type: 'timestamp',
            default: 'current_timestamp',
          },
          {
            name: 'updated_date',
            type: 'timestamp',
            default: 'current_timestamp',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('report_cache', true);
  }
}
