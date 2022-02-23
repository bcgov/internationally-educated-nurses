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
          },
          {
            name: 'file_name',
            type: 'varchar',
          },
          {
            name: 'file_path',
            type: 'varchar',
          },
          {
            name: 'created_date',
            type: 'timestamp',
          },
          {
            name: 'updated_date',
            type: 'timestamp',
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
