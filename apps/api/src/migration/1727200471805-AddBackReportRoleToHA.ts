import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBackReportRoleToHA1727200471805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO employee_roles_role (employee_id, role_id)
        SELECT e.id, r.id
        FROM employee e
        JOIN ien_ha_pcn ha ON ha.title = e.organization
        JOIN role r ON r.slug = 'reporting'
        WHERE NOT EXISTS (
            SELECT 1
            FROM employee_roles_role err
            WHERE err.employee_id = e.id
            AND err.role_id = r.id
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
