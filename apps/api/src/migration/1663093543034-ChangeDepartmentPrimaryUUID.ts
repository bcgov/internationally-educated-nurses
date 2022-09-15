import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeDepartmentPrimaryUUID1663093543034 implements MigrationInterface {
  DEPARTMENTS = [
    {
      id: '3C214DC1-7EF7-48FF-904E-07E4B7C99154',
      name: 'Medicine/Surgery',
    },
    {
      id: '0C08F63B-E4B7-4F97-94AD-14355C449D89',
      name: 'Wound Care',
    },
    {
      id: '146B886D-1071-4235-A976-16872FD559D6',
      name: 'Community Health',
    },
    {
      id: '35886771-C411-4134-B36E-1C009356D656',
      name: 'Recovery',
    },
    {
      id: '61EAC0C9-C8B5-44EB-8596-25FF6B5F27E4',
      name: 'Clinical Educator',
    },
    {
      id: 'FE602B86-0F28-443F-8B8A-28CEB9487D34',
      name: 'Aboriginal Health Nursing',
    },
    {
      id: 'BE7D837E-2A7F-4535-BAF3-2C67C75A494F',
      name: 'Geriatrics/Gerontology',
    },
    {
      id: 'BFB413DD-BB3B-4103-8A20-2C9CAF072381',
      name: 'Operating Room (Pediatric)',
    },
    {
      id: '23BE194C-C036-4068-889C-2D60A74D8DDA',
      name: 'Still in School',
    },
    {
      id: 'A605E489-12DF-4709-8E87-2DD2D0914FF0',
      name: 'Transitional Care Nurse',
    },
    {
      id: 'A322208B-A182-49D2-AE39-2F4950F9D909',
      name: 'Midwifery',
    },
    {
      id: 'DCE86B22-A069-41AC-9EC1-33009486041A',
      name: 'Neonatal Intensive Care',
    },
    {
      id: 'E1252477-4359-41AF-B044-3815EAB20A93',
      name: 'Post Anesthetic',
    },
    {
      id: '5520E993-7345-4764-9461-3C7882D72485',
      name: 'Clinical Coordinator',
    },
    {
      id: 'C6065DA4-9316-433E-BADC-414DFDB3AD0B',
      name: 'Nurse Executive',
    },
    {
      id: 'ECD212A7-C311-40B1-B794-46976D556602',
      name: 'Occupational Health',
    },
    {
      id: 'C2ED031A-7A43-4230-A110-495453AF24BA',
      name: 'Maternity (Labour and Delivery)',
    },
    {
      id: 'A898B287-2EA8-4024-8211-525ABAAC2B99',
      name: 'Outreach',
    },
    {
      id: '3E502B62-FCF5-4C94-8A90-5730C5146E7C',
      name: 'Renal Dialysis',
    },
    {
      id: 'EB5F070C-1574-46B1-AF19-5BB129563A7C',
      name: 'Maternity (Antepartum & Postpartum)',
    },
    {
      id: '61EAEC85-877D-42C5-B83C-653B847B81F5',
      name: 'Rehabilitation/Spinal Unit',
    },
    {
      id: 'D62EACEA-366E-416C-BE25-65BC17CB2B7A',
      name: 'Emergency Room/trauma',
    },
    {
      id: 'E9BDA031-C7F4-41B3-91AE-663269233E9D',
      name: 'Management',
    },
    {
      id: 'A7240695-61F7-4714-B76A-68A64F10EEB6',
      name: 'Advanced Practice',
    },
    {
      id: '53C67B1C-1B09-4744-AFAB-6D9F978E42D0',
      name: 'New Graduate',
    },
    {
      id: '551D2141-5BCF-4233-9E09-6E9AA9C3519F',
      name: 'Education',
    },
    {
      id: '2AA85A92-B5FA-4F07-A61D-70E0EBF1EF3A',
      name: 'Pediatrics',
    },
    {
      id: 'A5A5380F-0417-4D7C-9A94-76E1D4A3E600',
      name: 'Operating Room (Adult)',
    },
    {
      id: '40521B21-F509-4A85-A90F-7D309D578FAC',
      name: 'Nursing Practitioner',
    },
    {
      id: '151407BF-A516-45FA-B70E-810F70DC54B2',
      name: 'Home Care',
    },
    {
      id: '9F8B315C-C2B7-41D0-BD90-8AE2CAA18E88',
      name: 'Oncology',
    },
    {
      id: 'F95EAC63-CA1F-469A-9790-9292C898A1B9',
      name: 'Cardiology - CCU/Telemetry',
    },
    {
      id: '3A7FD021-A9A1-409B-8D82-92DC55721F8A',
      name: 'Research',
    },
    {
      id: '8ADC0889-98B7-44FF-B76A-95D4B56BBB01',
      name: 'Clinical Nurse Leader',
    },
    {
      id: '0F16E3BB-BEE2-4324-AF0D-B6BD7297F585',
      name: 'Family Practice',
    },
    {
      id: 'B6CE425E-13B1-4C03-A8EC-B9B060804672',
      name: 'Neurology',
    },
    {
      id: 'A4C9524A-E494-46FC-B557-BBA640BDBC42',
      name: 'Communicable Disease Control',
    },
    {
      id: '6BA1AE9C-6357-48EA-B7D1-D293346A110E',
      name: 'Administration',
    },
    {
      id: '23CB321D-C9FD-4A9E-AE99-D375085A9C24',
      name: 'Rehabilitation',
    },
    {
      id: '8476C79B-26B0-4FAA-B8DC-D6FC93EC25E3',
      name: 'Critical Care/Transport',
    },
    {
      id: '88A68F52-4192-4822-8F70-DEC1EFAD254A',
      name: 'Infection Control',
    },
    {
      id: '6AD3FA80-51A2-4533-8F8B-E0DB05ECCF2D',
      name: 'Public Health',
    },
    {
      id: '25AA7723-F1F1-41D1-A45D-E5382B970DB6',
      name: 'Critical Care/ICU',
    },
    {
      id: '06697FE5-3ABE-417E-8821-ED286077D246',
      name: 'Palliative Care',
    },
    {
      id: 'D6C9B039-5C39-4094-BC8A-ED446E16C733',
      name: 'Chronic Disease/Diabetes',
    },
    {
      id: '0748FEE9-4270-4C72-ABA1-EF23E36DA9BF',
      name: 'Psychiatry/Mental Health',
    },
  ];

  /**
   * Approach to change primary key with relations
   * @param queryRunner
   * @private
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    //change department/job id to uuid
    const table = 'ien_job_titles';
    const referer = 'ien_applicant_jobs';
    await queryRunner.query(`
      ALTER TABLE "${table}" ADD COLUMN "uid" uuid DEFAULT NULL;
    `);
    const oldDepartments: { id: string; title: string }[] = await queryRunner.query(
      `SELECT id, title FROM "${table}";`,
    );
    const result = await queryRunner.query(`SELECT max(id) from ${table};`);
    let max = result[0].max;
    await Promise.all(
      this.DEPARTMENTS.map(({ name, id }) => {
        const old = oldDepartments.find(d => d.title === name);
        if (old) {
          return queryRunner.query(`
            UPDATE "${table}" SET uid = '${id}' WHERE title = '${name}';
          `);
        } else {
          max += 1;
          return queryRunner.query(`
            INSERT INTO "${table}" (id, uid, title) VALUES (${max}, '${id}', '${name}');
          `);
        }
      }),
    );
    await queryRunner.query(`
      ALTER TABLE "${referer}" ADD COLUMN "temp_uid" uuid;
    `);
    const jobs: { id: string; job_title_id: number }[] = await queryRunner.query(`
      SELECT id, job_title_id FROM "${referer}";
    `);
    await Promise.all(
      jobs
        .filter(job => job.job_title_id)
        .map(job => {
          return queryRunner.query(`
          UPDATE "${referer}" r
          SET "temp_uid" = (SELECT uid FROM "${table}" t WHERE t.id = '${job.job_title_id}')
          WHERE r.id = '${job.id}'
        `);
        }),
    );
    await queryRunner.query(`
      ALTER TABLE "${referer}" DROP CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e";
    `);
    await queryRunner.query(`
      ALTER TABLE "${referer}" DROP COLUMN "job_title_id";
    `);
    await queryRunner.query(`
      ALTER TABLE "${referer}" RENAME COLUMN "temp_uid" TO "job_title_id";
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
      ALTER TABLE public.${referer} ADD CONSTRAINT "FK_8bcb90fa2ca3ea5c1e341b2ee4e" FOREIGN KEY (job_title_id) REFERENCES public.${table}(id);
    `);
  }

  public async down(): Promise<void> {
    /* no rollback */
  }
}
