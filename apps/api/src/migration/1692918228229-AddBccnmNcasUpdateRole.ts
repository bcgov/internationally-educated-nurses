import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBccnmNcasUpdateRole1692918228229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "access" ("name", "description", "slug")
        VALUES ('BCCNM/NCAS', 'Upload BCCNM/NCAS updates', 'bccnm-ncas');
      INSERT INTO "role" ("name", "description", "slug")
        VALUES ('BCCNM/NCAS', 'Upload BCCNM/NCAS updates', 'bccnm-ncas');
      INSERT INTO "role_acl_access" VALUES 
        ((SELECT id FROM "role" WHERE "slug" = 'admin'), (SELECT id FROM "access" WHERE "slug" = 'bccnm-ncas')),
        ((SELECT id FROM "role" WHERE "slug" = 'bccnm-ncas'), (SELECT id FROM "access" WHERE "slug" = 'bccnm-ncas'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "role" WHERE "slug" = 'bccnm-ncas';
      DELETE FROM "access" WHERE "slug" = 'bccnm-ncas';
    `);
  }
}
