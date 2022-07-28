import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteReportAccessFromManageApplicant1659037176931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM role_acl_access
      WHERE
       role_id = (SELECT id FROM "role" WHERE name = 'Manage Applicants') AND
       access_id = (SELECT id FROM access WHERE slug = 'reporting')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Manage Applicants'),
          (SELECT id FROM access WHERE slug = 'reporting')
        )
      ON CONFLICT(role_id, access_id) DO NOTHING;
    `);
  }
}
