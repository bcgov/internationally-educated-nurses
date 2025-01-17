import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeleteInfoAndBackupToIenApplicants1737077728589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('ien_applicants', [
      new TableColumn({
        name: 'deleted_by_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'deleted_date',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'backup',
        type: 'jsonb',
        isNullable: true,
        default: null,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('ien_applicants', ['deleted_by_id', 'deleted_date', 'backup']);
  }
}
