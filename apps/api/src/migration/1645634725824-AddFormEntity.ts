import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddFormEntity1645634725824 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'form',
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
            name: 'file_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'file_path',
            type: 'varchar',
            isNullable: true,
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
          {
            name: 'form_data',
            type: 'jsonb',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('form', true);
  }
}
