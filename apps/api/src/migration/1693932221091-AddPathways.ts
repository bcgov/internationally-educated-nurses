import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddPathways1693932221091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pathway',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.query(`
      insert into "pathway" ("id", "name") values
        ('dc2b2ac5-26e9-4f9d-9b24-831d216d84e1', 'Learn only'),
        ('83c7319e-ef76-443c-a5af-baa9ba99d069', 'Earn and Learn - Currently working as an HCA'),
        ('18c138d0-5d52-47c2-8706-e786f7e2d548', 'Earn and Learn - Currently working as an LPN'),
        ('b290f4de-d2cd-420b-9866-f9dc0163a120', 'Direct to Registration')
    `);

    await queryRunner.addColumn(
      'ien_applicants',
      new TableColumn({
        name: 'pathway_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'ien_applicants',
      new TableForeignKey({
        name: 'fk_applicant_pathway',
        columnNames: ['pathway_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pathway',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ien_applicants', 'pathway_id');
    await queryRunner.dropTable('pathway');
  }
}
