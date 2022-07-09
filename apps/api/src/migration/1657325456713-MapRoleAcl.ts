import { MigrationInterface, QueryRunner } from 'typeorm';

export class MapRoleAcl1657325456713 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE access (
        id serial PRIMARY KEY,
        name varchar NOT NULL,
        description varchar NOT NULL,
        slug varchar NOT NULL
      );
    `);
    await queryRunner.query(`
      INSERT INTO access
        (name, description, slug)
      VALUES
        ('Read User', 'View application users and their details', 'user-read'),
        ('Write User', 'Add or update user details and access roles', 'user-write'),
        ('Reporting', 'Generate and download reports', 'reporting'),
        ('Read Applicant', 'View applicant details and milestones', 'applicant-read'),
        ('Write Applicant', 'Add or update applicant details and milestones', 'applicant-write'),
        ('Extract Data', 'Extract applicants data', 'data-extract')
      ;
    `);
    await queryRunner.query(`
      CREATE TABLE role_acl_access (
        role_id serial,
        access_id serial,
        PRIMARY KEY (role_id, access_id),
        FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
        FOREIGN KEY (access_id) REFERENCES access(id) ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      UPDATE "role"
      SET
        name = 'Administrator',
        slug = 'admin'
      WHERE name = 'roleadmin';
    `);
    await queryRunner.query(`
      UPDATE "role"
      SET
        name = 'Manage Applicants',
        slug = 'manage-applicant',
        description = 'Manage applicants details and milestones'
      WHERE name = 'ha';
    `);
    await queryRunner.query(`
      UPDATE "role"
      SET
        name = 'Provisioner',
        slug = 'provisioner',
        description = 'Manage user details and access roles'
      WHERE name = 'hmbc';
    `);
    await queryRunner.query(`
      UPDATE "role"
      SET
        name = 'Reporting',
        slug = 'reporting',
        description = 'Generate and download reports'
      WHERE name = 'moh';
    `);
    await queryRunner.query(`
      INSERT INTO "role"
        (name, slug, description)
      VALUES
        ('Data Extract', 'data-extract', 'Extract applicants data');
    `);
    await queryRunner.query(`
      DO $$
      BEGIN 
        FOR access_id IN 1..6
        LOOP 
          INSERT INTO role_acl_access
            (role_id, access_id)
          VALUES
            (
              (SELECT id FROM "role" WHERE name = 'Administrator'),
              access_id
            );
        END LOOP;
      END; $$;
    `);

    await queryRunner.query(`
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Provisioner'),
          (SELECT id FROM access WHERE slug = 'user-read')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Provisioner'),
          (SELECT id FROM access WHERE slug = 'user-write')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Reporting'),
          (SELECT id FROM access WHERE slug = 'reporting')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Manage Applicants'),
          (SELECT id FROM access WHERE slug = 'reporting')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Manage Applicants'),
          (SELECT id FROM access WHERE slug = 'applicant-read')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Manage Applicants'),
          (SELECT id FROM access WHERE slug = 'applicant-write')
        );
      
      INSERT INTO role_acl_access
        (role_id, access_id)
      VALUES
        (
          (SELECT id FROM "role" WHERE name = 'Data Extract'),
          (SELECT id FROM access WHERE slug = 'data-extract')
        );
    `);

    await queryRunner.query(`
      DO $$
      DECLARE 
        u record;
      BEGIN 
        FOR u IN
          SELECT e.id FROM employee e INNER JOIN employee_roles_role err ON err.employee_id = e.id
        LOOP
          DELETE FROM employee_roles_role WHERE employee_id = u.id;
          
          INSERT INTO employee_roles_role
            (role_id, employee_id)
          VALUES 
            (
              (SELECT id FROM "role" WHERE slug = 'manage-applicant'),
              u.id
            );
            
          INSERT INTO employee_roles_role
            (role_id, employee_id)
          VALUES 
            (
              (SELECT id FROM "role" WHERE slug = 'reporting'),
              u.id
            );
          
        END LOOP;
      END; $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "role"
      SET
        name = 'roleadmin',
        slug = 'roleadmin'
      WHERE slug = 'admin';
      
      UPDATE "role"
      SET
        name = 'ha',
        slug = 'ha',
        description = 'Health Authority'
      WHERE slug = 'manage-applicant';
      
      UPDATE "role"
      SET
        name = 'hmbc',
        slug = 'hmbc',
        description = 'Health Match BC'
      WHERE slug = 'provisioner';
      
      UPDATE "role"
      SET
        name = 'moh',
        slug = 'moh',
        description = 'Ministry of Health'
      WHERE slug = 'reporting';
      
      DELETE FROM "role" WHERE slug = 'data-extract';
    `);
    await queryRunner.dropTable('role_acl_access');
    await queryRunner.dropTable('access');
  }
}
