import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeAuthorityPrimaryUUID1663108356951 implements MigrationInterface {
  AUTHORITIES = [
    {
      id: '1ADC5904-17A8-B4CA-55C5-3A05E5B6797F',
      name: 'Vancouver Island Health Authority',
      abbreviation: 'VIHA',
    },
    {
      id: 'F314A4D7-86AD-0696-26F5-3A05E5B6FB7F',
      name: 'Vancouver Coastal Health Authority',
      abbreviation: 'VCHA',
    },
    {
      id: '6AD69443-E3A8-3CBC-8CC9-3A05E5B771E4',
      name: 'Fraser Health Authority',
      abbreviation: 'FHA',
    },
    {
      id: '5C81ED72-6285-7F28-FAF0-3A05E5B8024F',
      name: 'Interior Health Authority',
      abbreviation: 'IHA',
    },
    {
      id: '28F4B8FD-588B-C170-3434-3A05E5B88823',
      name: 'Northern Health Authority',
      abbreviation: 'NHA',
    },
    {
      id: '0388F125-E89F-2DF7-24A0-3A05E5C0956D',
      name: 'Provincial Health Services Authority',
      abbreviation: 'PHSA',
    },
    {
      id: '44B31F94-A91E-7DE3-9BF7-3A05E5C2A625',
      name: 'Providence Health Care Society',
      abbreviation: 'PHC',
    },
    {
      id: 'FEDB572A-C723-4DF7-C478-3A05E5C34A82',
      name: 'First Nations Health Authority',
      abbreviation: 'FNHA',
    },
  ];

  private async migrateColumn(
    queryRunner: QueryRunner,
    table: string,
    referer: string,
    refererColumn: string,
  ) {
    await queryRunner.query(`
      ALTER TABLE "${referer}" ADD COLUMN "temp_uid" uuid;
    `);
    const jobs: { id: string; ref_col: number }[] = await queryRunner.query(`
      SELECT id, ${refererColumn} as ref_col FROM "${referer}";
    `);
    await Promise.all(
      jobs
        .filter(job => job.ref_col)
        .map(job => {
          return queryRunner.query(`
          UPDATE "${referer}" r
          SET "temp_uid" = (SELECT uid FROM "${table}" t WHERE t.id = '${job.ref_col}')
          WHERE r.id = '${job.id}'
        `);
        }),
    );
    await queryRunner.query(`
      ALTER TABLE "${referer}" DROP COLUMN "${refererColumn}";
    `);
    await queryRunner.query(`
      ALTER TABLE "${referer}" RENAME COLUMN "temp_uid" TO "${refererColumn}";
    `);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // DROP UNUSED REFERENCING TABLE
    await queryRunner.dropTable('ien_applicants_ha_pcn_ien_ha_pcn');

    const table = 'ien_ha_pcn';

    // UPDATE TABLE WITH NEW DATA
    await queryRunner.query(`
      ALTER TABLE "${table}" ADD COLUMN "uid" uuid DEFAULT NULL;
    `);
    const oldAuthorities: { id: string; title: string }[] = await queryRunner.query(
      `SELECT id, title FROM "${table}";`,
    );
    const result = await queryRunner.query(`SELECT max(id) from ${table};`);
    let max = result[0].max;
    await Promise.all(
      this.AUTHORITIES.map(({ name, id, abbreviation }) => {
        const old = oldAuthorities.find(d => d.title === name);
        if (old) {
          return queryRunner.query(`
            UPDATE "${table}" SET uid = '${id}' WHERE title = '${name}';
          `);
        } else {
          max += 1;
          return queryRunner.query(`
            INSERT INTO "${table}" (id, uid, title, abbreviation) VALUES (${max}, '${id}', '${name}', '${abbreviation}');
          `);
        }
      }),
    );

    await queryRunner.query(`
      ALTER TABLE "ien_applicant_jobs" DROP CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e";
    `);
    await queryRunner.query(`
      ALTER TABLE "ien_job_locations" DROP CONSTRAINT "ien_job_locations_ien_ha_pcn_fk_ha_pcn_id";
    `);

    // UPDATE REFERENCING TABLE - ien_applicant_jobs, ien_job_locations
    await this.migrateColumn(queryRunner, 'ien_ha_pcn', 'ien_applicant_jobs', 'ha_pcn_id');
    await this.migrateColumn(queryRunner, 'ien_ha_pcn', 'ien_job_locations', 'ha_pcn_id');

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
      ALTER TABLE public.ien_applicant_jobs ADD CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e" FOREIGN KEY (ha_pcn_id) REFERENCES public.ien_ha_pcn(id);
    `);
    await queryRunner.query(`
      ALTER TABLE public.ien_job_locations ADD CONSTRAINT "ien_job_locations_ien_ha_pcn_fk_ha_pcn_id" FOREIGN KEY (ha_pcn_id) REFERENCES public.ien_ha_pcn(id);
    `);
  }

  public async down(): Promise<void> {
    /* no rollback */
  }
}
