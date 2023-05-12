import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminAccess1684340041778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO access(name, description, slug)
      VALUES ('Admin', 'Admin & Maintenance', 'admin')
    `);
    await queryRunner.query(`
      INSERT INTO role_acl_access(role_id, access_id)
      VALUES (
        (SELECT id FROM role WHERE slug = 'admin'),
        (SELECT id from access WHERE slug = 'admin')
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM access WHERE slug = 'admin'
    `);
  }
}
