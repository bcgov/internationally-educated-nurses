import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuthorityColumnToLocation1659647436943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // language=SQL format=false
    await queryRunner.query(`
      ALTER TABLE ien_job_locations ADD COLUMN ha_pcn_id INT
      CONSTRAINT ien_job_locations_ien_ha_pcn_fk_ha_pcn_id REFERENCES ien_ha_pcn (id)
      ON UPDATE CASCADE ON DELETE CASCADE;
      
      UPDATE ien_job_locations
        SET ha_pcn_id = (SELECT id FROM ien_ha_pcn WHERE abbreviation = 'FHA')
      WHERE title IN (
        'Abbotsford',
        'Agassiz-Harrison',
        'Burnaby',
        'Chilliwack',
        'Delta',
        'Hope',
        'Langley',
        'Maple Ridge-Pitt Meadows',
        'Mission',
        'New Westminster',
        'South Surrey-White Rock',
        'Surrey',
        'Tri-Cities'
      );
      
      UPDATE ien_job_locations
        SET ha_pcn_id = (SELECT id FROM ien_ha_pcn WHERE abbreviation = 'IHA')
      WHERE title IN (
        '100 Mile House',
        'Armstrong-Spallumcheen',
        'Arrow Lakes',
        'Cariboo-Chilcotin',
        'Castlegar',
        'Central Okanagan',
        'Cranbrook',
        'Creston',
        'Enderby',
        'Fernie',
        'Golden',
        'Grand Forks',
        'Kamloops',
        'Keremeos',
        'Kettle Valley',
        'Kimberley',
        'Kootenay Lake',
        'Lillooet',
        'Merritt',
        'Nelson',
        'North Thompson',
        'Penticton',
        'Princeton',
        'Revelstoke',
        'Salmon Arm',
        'South Cariboo',
        'Southern Okanagan',
        'Summerland',
        'Trail',
        'Vernon',
        'Windermere'
      );
      
      UPDATE ien_job_locations
        SET ha_pcn_id = (SELECT id FROM ien_ha_pcn WHERE abbreviation = 'VIHA')
      WHERE title IN (
        'Alberni-Clayoquot',
        'Comox Valley',
        'Cowichan Valley North',
        'Cowichan Valley South',
        'Cowichan Valley West',
        'Greater Campbell River',
        'Greater Nanaimo',
        'Greater Victoria',
        'Oceanside',
        'Saanich Peninsula',
        'Southern Gulf Islands',
        'Vancouver Island North',
        'Vancouver Island West',
        'Western Communities'
      );
      
      UPDATE ien_job_locations
        SET ha_pcn_id = (SELECT id FROM ien_ha_pcn WHERE abbreviation = 'NHA')
      WHERE title IN (
        'Burns Lake',
        'Fort Nelson',
        'Haida Gwaii',
        'Kitimat',
        'Nechako',
        'Nisga''a',
        'Peace River North',
        'Peace River South',
        'Prince George',
        'Prince Rupert',
        'Quesnel',
        'Smithers',
        'Snow Country',
        'Stikine',
        'Telegraph Creek',
        'Terrace',
        'Upper Skeena'
      );
      
      UPDATE ien_job_locations
        SET ha_pcn_id = (SELECT id FROM ien_ha_pcn WHERE abbreviation = 'VCHA')
      WHERE title IN (
            'Richmond',
            'Vancouver',
            'North Vancouver',
            'West Vancouver-Bowen Island',
            'Sunshine Coast',
            'Powell River',
            'Howe Sound',
            'Bella Coola Valley',
            'Central Coast'
      );
      
      ALTER TABLE ien_job_locations ALTER COLUMN ha_pcn_id SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ien_job_locations" DROP COLUMN IF EXISTS "ha_pcn_id";
    `);
  }
}
