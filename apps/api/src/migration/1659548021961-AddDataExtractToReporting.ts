import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDataExtractToReporting1659548021961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Reporting'),
          (SELECT id FROM access WHERE slug = 'data-extract')
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role_acl_access
      WHERE
        role_id = (SELECT id FROM "role" WHERE name = 'Reporting') and
        access_id = (SELECT id FROM access WHERE slug = 'data-extract')
    `);
  }
}
