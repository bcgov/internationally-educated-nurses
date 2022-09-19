import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SetDefaultValueForNursingEducation1663620924440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `update ien_applicants set nursing_educations = '"[]"'  WHERE nursing_educations IS NULL;`,
    );
    await queryRunner.changeColumn(
      'ien_applicants',
      'nursing_educations',
      new TableColumn({
        name: 'nursing_educations',
        type: 'jsonb',
        isNullable: false,
        default: "'[]'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'ien_applicants',
      'nursing_educations',
      new TableColumn({
        name: 'nursing_educations',
        type: 'jsonb',
        isNullable: true,
      }),
    );
    await queryRunner.query(
      `update ien_applicants set nursing_educations = NULL WHERE nursing_educations = "[]";`,
    );
    return;
  }
}
