import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailInUserTable1651041591733 implements MigrationInterface {
  name = 'AddEmailInUserTable1651041591733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_users" ADD "email" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ien_users" DROP COLUMN "email"`);
  }
}
