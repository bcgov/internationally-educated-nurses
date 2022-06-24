import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEmailNullableInEmployeeTable1656092643403 implements MigrationInterface {
  name = 'MakeEmailNullableInEmployeeTable1656092643403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "email" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "email" SET NOT NULL`);
  }
}
