import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveReportRoleFromHA1695251583963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM employee_roles_role err
      USING employee e, role r, ien_ha_pcn ha
      WHERE
        e.id = err.employee_id AND
        ha.title = e.organization AND
        r.id = err.role_id AND
        r.slug = 'reporting';
    `);
  }

  public async down(): Promise<void> {
    /* do nothing */
  }
}
