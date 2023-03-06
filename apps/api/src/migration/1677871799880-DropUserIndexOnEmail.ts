import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUserIndexOnEmail1677871799880 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('ien_users');
    if (table) {
      await queryRunner.dropIndex(table, 'IDX_6dce5313d82a7d8f5208cc005d');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6dce5313d82a7d8f5208cc005d" ON "ien_users" ("user_id") `,
    );
  }
}
