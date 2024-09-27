import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteNonuseNHCommunities1727287611192 implements MigrationInterface {
  static NHA_ID = `(SELECT id FROM ien_ha_pcn WHERE abbreviation = 'NHA')`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM public.ien_job_locations
        WHERE ha_pcn_id = ${DeleteNonuseNHCommunities1727287611192.NHA_ID}
        AND title IN ('Haida Gwaii', 'Snow Country', 'Upper Skeena', 'Stikine', 'Nisga''a', 'Telegraph Creek', 'Nechako', 'Peace River South', 'Peace River North');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO public.ien_job_locations (id, title, ha_pcn_id) VALUES
          (30, 'Haida Gwaii', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (64, 'Snow Country', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (77, 'Upper Skeena', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (69, 'Stikine', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (47, 'Nisga''a', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (73, 'Telegraph Creek', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (44, 'Nechako', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (51, 'Peace River North', ${DeleteNonuseNHCommunities1727287611192.NHA_ID}),
          (52, 'Peace River South', ${DeleteNonuseNHCommunities1727287611192.NHA_ID});
      `);
  }
}
