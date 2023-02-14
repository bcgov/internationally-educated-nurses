import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFlagForApplicantProcess1676383627579 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ien_applicants',
      new TableColumn({
        type: 'boolean',
        name: 'new_bccnm_process',
        isNullable: false,
        default: false,
      }),
    );

    await queryRunner.query(
      `UPDATE ien_applicants SET new_bccnm_process = (registration_date >= '2023-01-30')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ien_applicants', 'new_bccnm_process');
  }
}
