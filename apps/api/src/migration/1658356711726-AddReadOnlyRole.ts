import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadOnlyRole1658356711726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const role = {
      name: 'View Applicants',
      slug: 'applicant-read',
      description: 'View applicants details and milestones',
    };
    await queryRunner.manager.createQueryBuilder().insert().into('role').values(role).execute();
    await queryRunner.query(`
      INSERT INTO role_acl_access (role_id, access_id ) VALUES
      (
        (SELECT id FROM role WHERE slug = 'applicant-read'),
        (SELECT id FROM access WHERE slug = 'applicant-read')
      )
    `);
    await queryRunner.query(
      `UPDATE role SET slug = 'applicant-write' WHERE slug = 'manage-applicant'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('role')
      .where({ slug: 'applicant-read' })
      .execute();
    await queryRunner.query(
      `UPDATE role SET slug = 'manage-applicant' WHERE slug = 'applicant-write'`,
    );
  }
}
