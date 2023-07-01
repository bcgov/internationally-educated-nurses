import { MigrationInterface, QueryRunner } from 'typeorm';
import { Authorities } from '@ien/common';
import { EmployeeEntity } from '../employee/entity/employee.entity';

export class SetEmployeeOrganization1688582111860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const employees = await queryRunner.query(`
      SELECT * FROM employee WHERE organization IS NULL 
    `);
    await Promise.all(
      employees.map((employee: EmployeeEntity) => {
        const domain = employee.email.split('@')[1];
        const ha = Object.values(Authorities).find(a => a.domains.includes(domain));
        if (ha) {
          return queryRunner.query(`
            UPDATE employee SET organization = '${ha.name}' WHERE id = '${employee.id}'
        `);
        }
      }),
    );
  }

  public async down(): Promise<void> {
    /* DO NOTHING */
  }
}
