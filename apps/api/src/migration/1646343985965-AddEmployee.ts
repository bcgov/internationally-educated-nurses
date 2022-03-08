import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AddEmployee1646343985965 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employee',
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
            name: 'name',
            type: 'varchar',
            isNullable: false,
            length: '128',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
            length: '128',
          },
          {
            name: 'role',
            type: 'varchar',
            isNullable: false,
            length: '128',
          },
          {
            name: 'keycloak_id',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
            length: '128',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
