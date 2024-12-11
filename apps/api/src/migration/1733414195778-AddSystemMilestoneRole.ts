import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSystemMilestoneRole1733414195778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ADMIN_SLUG = 'admin';
    const READ_SYSTEM_MILESTONE_SLUG = 'read-system-milestone';
    const WRITE_SYSTEM_MILESTONE_SLUG = 'write-system-milestone';
    const SYSTEM_MILESTONE_SLUG = 'system-milestone';
    await queryRunner.query(`
          INSERT INTO "access" ("name", "description", "slug")
            VALUES ('Read System Milestone', 'View system milestones', '${READ_SYSTEM_MILESTONE_SLUG}'),
                   ('Write System Milestone', 'Add, update or delete system milestones', '${WRITE_SYSTEM_MILESTONE_SLUG}');
          INSERT INTO "role" ("name", "description", "slug")
            VALUES ('System Milestone', 'Manage system milestones', '${SYSTEM_MILESTONE_SLUG}');
          INSERT INTO "role_acl_access" VALUES 
            ((SELECT id FROM "role" WHERE "slug" = '${ADMIN_SLUG}'), (SELECT id FROM "access" WHERE "slug" = '${READ_SYSTEM_MILESTONE_SLUG}')),
            ((SELECT id FROM "role" WHERE "slug" = '${ADMIN_SLUG}'), (SELECT id FROM "access" WHERE "slug" = '${WRITE_SYSTEM_MILESTONE_SLUG}')),
            ((SELECT id FROM "role" WHERE "slug" = '${SYSTEM_MILESTONE_SLUG}'), (SELECT id FROM "access" WHERE "slug" = '${READ_SYSTEM_MILESTONE_SLUG}')),
            ((SELECT id FROM "role" WHERE "slug" = '${SYSTEM_MILESTONE_SLUG}'), (SELECT id FROM "access" WHERE "slug" = '${WRITE_SYSTEM_MILESTONE_SLUG}'));
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const READ_SYSTEM_MILESTONE_SLUG = 'read-system-milestone';
    const WRITE_SYSTEM_MILESTONE_SLUG = 'write-system-milestone';
    const SYSTEM_MILESTONE_SLUG = 'system-milestone';

    await queryRunner.query(`
      DELETE FROM "role_acl_access" WHERE "accessId" IN (
        SELECT id FROM "access" WHERE "slug" IN ('${READ_SYSTEM_MILESTONE_SLUG}', '${WRITE_SYSTEM_MILESTONE_SLUG}')
      );
      DELETE FROM "role" WHERE "slug" = '${SYSTEM_MILESTONE_SLUG}';
      DELETE FROM "access" WHERE "slug" IN ('${READ_SYSTEM_MILESTONE_SLUG}', '${WRITE_SYSTEM_MILESTONE_SLUG}');
    `);
  }
}
