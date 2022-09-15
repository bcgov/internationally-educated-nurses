import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeReasonPrimaryUUID1663108314337 implements MigrationInterface {
  REASONS = [
    {
      id: 'FF4B82C9-1E4D-4561-84AA-08EB2DD9D37E',
      name: 'Cost of the IEN process',
      i_e_n_program: true,
      recruitment: false,
    },
    {
      id: 'BFFAFBFD-EDFD-4F62-B72B-25E33BB55992',
      name: 'Timing',
      i_e_n_program: true,
      recruitment: false,
    },
    {
      id: 'A1E0E2C1-E272-468A-8F7A-28686B750CAE',
      name: 'Withdrew from IEN program',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'E0930E51-630A-474F-BAE1-31E52A552CBB',
      name: 'Pursuing licensure in another province',
      i_e_n_program: true,
      recruitment: false,
    },
    {
      id: '74905D23-EF3D-453C-A2F2-45E4E2798A0B',
      name: 'Accepted another job outside of BC',
      i_e_n_program: true,
      recruitment: true,
    },
    {
      id: '3F84D93D-C122-4895-8D49-4D975F0D0005',
      name: 'Accepted another nursing job (public or private) outside of BC',
      i_e_n_program: true,
      recruitment: true,
    },
    {
      id: 'B1E993D1-58EC-4FE5-A31B-532E070C805B',
      name: 'Accepted another nursing job (public) in BC',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: '579AF591-F009-4E8F-806A-61EB3920CA1B',
      name: 'Job search on hold',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'AFC1B84C-682D-4F4A-A624-65174A74F02D',
      name: 'Community - Cost of living',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'E2958403-CB56-4396-B903-654C1FE787CC',
      name: 'Other',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: '583C72E3-6D58-4E0B-ADC1-7F5E89A62CD5',
      name: 'Compensation (pay/benefits)',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'C09A8B50-7FE5-4EED-84E5-810CCB17F5D4',
      name: 'Revoked job search',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'ED497BF5-4E1D-46A0-852B-921628125839',
      name: 'Unresponsive',
      i_e_n_program: true,
      recruitment: true,
    },
    {
      id: 'C9C6BD85-35AC-443D-91D5-C488594622AB',
      name: 'Community - Limited accommodation/housing available',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: 'FD756221-0F02-4484-9F8F-DB78E94E78EB',
      name: 'Job suitability',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: '1886B20E-17FF-41E6-8915-ECF6E03900DB',
      name: 'Accepted another job in BC',
      i_e_n_program: true,
      recruitment: true,
    },
    {
      id: 'F281B9A1-E1F7-4984-9CD1-ECF805819926',
      name: 'Accepted another nursing job (private) in BC',
      i_e_n_program: false,
      recruitment: true,
    },
    {
      id: '49873A72-AB2D-4349-AD4D-EE49CEB8288F',
      name: 'Personal reasons',
      i_e_n_program: true,
      recruitment: true,
    },
    {
      id: '1824580D-ED74-4E37-BA1C-F15DBB3878D2',
      name: 'Cannot meet the program criteria',
      i_e_n_program: true,
      recruitment: false,
    },
    {
      id: '031CBA24-8B47-4AD8-A932-FA2FA858B25B',
      name: 'Immigration concerns/issues',
      i_e_n_program: false,
      recruitment: true,
    },
  ];

  private async migrate(queryRunner: QueryRunner): Promise<void> {
    //change department/job id to uuid
    const table = 'ien_status_reasons';
    const referer = 'ien_applicant_status_audit';
    await queryRunner.query(`
      ALTER TABLE "${table}" ADD COLUMN "uid" uuid DEFAULT NULL;
    `);
    const oldReasons: { id: string; name: string }[] = await queryRunner.query(
      `SELECT id, name FROM "${table}";`,
    );
    const result = await queryRunner.query(`SELECT max(id) from ${table};`);
    let max = result[0].max;
    await Promise.all(
      this.REASONS.map(({ name, id, i_e_n_program, recruitment }) => {
        const old = oldReasons.find(d => d.name === name);
        if (old) {
          return queryRunner.query(`
            UPDATE "${table}" SET uid = '${id}' WHERE name = '${name}';
          `);
        } else {
          max += 1;
          return queryRunner.query(`
            INSERT INTO "${table}" (id, uid, name, i_e_n_program, recruitment) VALUES (${max}, '${id}', '${name}', ${i_e_n_program}, ${recruitment});
          `);
        }
      }),
    );
    await queryRunner.query(`
      ALTER TABLE "${referer}" ADD COLUMN "temp_uid" uuid;
    `);
    const audits: { id: string; reason_id: number }[] = await queryRunner.query(`
      SELECT id, reason_id FROM "${referer}";
    `);
    await Promise.all(
      audits
        .filter(audit => audit.reason_id)
        .map(audit => {
          return queryRunner.query(`
          UPDATE "${referer}" r
          SET "temp_uid" = (SELECT uid FROM ${table} t WHERE t.id = '${audit.reason_id}')
          WHERE r.id = '${audit.id}'
        `);
        }),
    );
    await queryRunner.query(`
      ALTER TABLE "${referer}" DROP CONSTRAINT "FK_045238bdd7d46415bcb9a4b9372";
    `);
    await queryRunner.query(`
      ALTER TABLE "${referer}" DROP COLUMN "reason_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "${referer}" RENAME COLUMN "temp_uid" TO "reason_id";
    `);

    await queryRunner.dropPrimaryKey(table);
    await queryRunner.dropColumn(table, 'id');
    await queryRunner.query(`
      DELETE FROM ${table} WHERE uid IS NULL;
    `);
    await queryRunner.changeColumn(
      table,
      'uid',
      new TableColumn({
        type: 'uuid',
        name: 'id',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'uuid',
      }),
    );

    await queryRunner.query(`
      ALTER TABLE public.${referer} ADD CONSTRAINT "FK_045238bdd7d46415bcb9a4b9372" FOREIGN KEY (reason_id) REFERENCES public.${table}(id);
    `);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.migrate(queryRunner);
  }

  public async down(): Promise<void> {
    /* no rollback */
  }
}
