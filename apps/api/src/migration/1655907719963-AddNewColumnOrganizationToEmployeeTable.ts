import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnOrganizationToEmployeeTable1655907719963 implements MigrationInterface {
  name = 'AddNewColumnOrganizationToEmployeeTable1655907719963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ADD "organization" character varying(128)`);
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "created_date" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "updated_date" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "email" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "updated_date" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ALTER COLUMN "created_date" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498"`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "employee" ADD "id" NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "organization"`);
  }
}
