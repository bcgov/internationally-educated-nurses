import { MigrationInterface, QueryRunner } from 'typeorm';

export class MapEmployeeRole1656532843389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "role" (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        slug varchar NOT NULL,
        description varchar DEFAULT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "employee_roles_role" (
        role_id serial,
        employee_id uuid,
        PRIMARY KEY(role_id, employee_id),
        FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
        FOREIGN KEY(employee_id) REFERENCES employee(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      INSERT INTO "role"
        (name, slug, description)
      VALUES
        ('roleadmin', 'roleadmin', 'Super User'),
        ('ha', 'ha', 'Health Authority'),
        ('hmbc', 'hmbc', 'Health Match BC'),
        ('moh', 'moh', 'Ministry of Health');
    `);

    await queryRunner.query(`
      INSERT INTO "employee_roles_role" (role_id, employee_id)
      SELECT r.id, e.id
      FROM employee e
      JOIN "role" r ON r.name = e.role;
    `);

    await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "role";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "employee" ADD COLUMN "role" varchar(128) ;`);
    await queryRunner.query(`
      UPDATE "employee" e
      SET
        role = t.name
      FROM
        (
          SELECT
          DISTINCT employee_id, r.name
          FROM "employee_roles_role"
          JOIN "role" r ON role_id = r.id
        ) AS t
      WHERE t.employee_id = e.id;
    `);
    await queryRunner.query(`DROP TABLE "employee_roles_role";`);
    await queryRunner.query(`DROP TABLE "role";`);
  }
}
