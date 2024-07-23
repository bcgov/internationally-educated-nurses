import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNHCommunities1720633134664 implements MigrationInterface {
  static newInsertCommunities = [
    { id: 85, title: 'Altin' },
    { id: 86, title: 'Chetwynd' },
    { id: 87, title: 'Daajing Giids' },
    { id: 88, title: 'Dawson Creek' },
    { id: 89, title: 'Dease Lake' },
    { id: 90, title: 'Fort St. James' },
    { id: 91, title: 'Fort St. John' },
    { id: 92, title: 'Fraser Lake' },
    { id: 93, title: 'Hazelton' },
    { id: 94, title: 'Houston' },
    { id: 95, title: `Hudson''s Hope` },
    { id: 96, title: 'Mackenzie' },
    { id: 97, title: 'Masset' },
    { id: 98, title: 'McBride' },
    { id: 99, title: 'Stewart' },
    { id: 100, title: 'Tumbler Ridge' },
    { id: 101, title: 'Valemount' },
    { id: 102, title: 'Vanderhoof' },
  ];

  static NHA_ID = `(SELECT id FROM ien_ha_pcn WHERE abbreviation = 'NHA')`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { id, title } of UpdateNHCommunities1720633134664.newInsertCommunities) {
      await queryRunner.query(
        `INSERT INTO public.ien_job_locations (id, title, ha_pcn_id) VALUES (${id}, '${title}', ${UpdateNHCommunities1720633134664.NHA_ID});`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { title } of UpdateNHCommunities1720633134664.newInsertCommunities) {
      await queryRunner.query(
        `DELETE FROM public.ien_job_locations WHERE title = '${title}' AND ha_pcn_id = ${UpdateNHCommunities1720633134664.NHA_ID};`,
      );
    }
  }
}
