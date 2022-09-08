import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateApplicantIDType1661894034139 implements MigrationInterface {
  milestones = [
    {
      id: '9066B792-6FBF-4E60-803F-0554E4B4DBA9',
      name: 'Completed Simulation Lab Assessment (SLA)',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '8A9B0D13-F5D7-4BE3-8D38-11E5459F9E9A',
      name: 'Applied to BCCNM',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '4D435C42-F588-4174-BB1E-1FE086B23214',
      name: 'Sent First Steps document to candidate',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '20268C6E-145E-48CD-889A-2346985DB957',
      name: 'Received NNAS Report',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'E68F902C-8440-4A9C-A05F-2765301DE800',
      name: 'Applied to NNAS',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'E768029B-4BA1-4147-94F8-29587C6BB650',
      name: 'Received Work Permit (Arrival in Canada)',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '61150E8A-6E83-444A-9DAB-3129A8CC0719',
      name: 'Completed Computer-Based Assessment (CBA)',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '74173FDE-B057-42DA-B2BA-327BDE532D2D',
      name: 'Received Permanent Residency',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '91F55FAA-C71D-83C8-4F10-3A05E778AFBC',
      name: 'BCCNM Provisional Licence LPN',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'D2656957-EC58-15C9-1E21-3A05E778DC8E',
      name: 'BCCNM Provisional Licence RN',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'D9AD22CD-7629-67EA-5734-3A05E77A47F6',
      name: 'REx-PN - Written',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '36B0CACF-ACD1-6BC5-3E4C-3A05E77A79C9',
      name: 'REx-PN - Passed',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '632374E6-CA2F-0BAA-F994-3A05E77C118A',
      name: 'BCCNM Full Licence LPN',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'CA858996-D1AD-2FE3-D8D3-3A05E77C9A2A',
      name: 'Registered as an HCA',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '5B4173E1-E750-9B85-9464-3A05E77D4547',
      name: 'Registration Journey Complete',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '73A4B092-AE7E-DE91-17E1-3A05E7864830',
      name: 'Applicant Referred to FNHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: 'DFCFA87A-40F9-EC41-2AFA-3A0601A9CE32',
      name: 'Applicant Referred to FHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: 'B5452D40-7DFD-D614-0319-3A0601AA0749',
      name: 'Applicant Referred to IHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: '9E97A1B3-A48E-3FB0-082C-3A0601AA2678',
      name: 'Applicant Referred to NHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: 'E5F02166-36CB-12A8-A5BA-3A0601AA5AED',
      name: 'Applicant Referred to PHC',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: '42054107-17FB-E6E7-EB58-3A0601AA8DD3',
      name: 'Applicant Referred to PHSA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: '26069C6C-A5B8-A2AC-C94D-3A0601AAB009',
      name: 'Applicant Referred to VCHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: '001DFB24-1618-E975-6578-3A0601AAC804',
      name: 'Applicant Referred to VIHA',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: 'DB964868-9EEB-E34D-9992-3A0601B2382C',
      name: 'Candidate Passed Pre-Screen',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '66D4EC85-6A28-87FD-0AAA-3A0601B26EDD',
      name: 'Candidate Did Not Pass Pre-Screen',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'BD91E596-8F9A-0C98-8B9C-3A0601B2A18B',
      name: 'Candidate Passed Interview',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '91C06396-A8F3-4D10-5A09-3A0601B2C98E',
      name: 'Candidate Did Not Pass Interview',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'D875B680-F027-46B7-05A5-3A0601B3A0E1',
      name: 'Candidate Passed Reference Check',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '4F5E371E-F05E-A374-443F-3A0601B3EEDE',
      name: 'Candidate Did Not Pass Reference Check',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '70B1F5F1-1A0D-EF71-42EA-3A0601B46BC2',
      name: 'Job Offer Accepted',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'FC048E66-0173-FA1A-D0D2-3A0601B4EA3A',
      name: 'Job Offer Not Accepted',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '22EA1AA6-78B7-ECB6-88A7-3A0601B53B20',
      name: 'Job Competition Cancelled',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '9B40266E-93C8-D827-B7CB-3A0601B593E0',
      name: 'HA is Not Interested',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'B8BA04A8-148E-AB32-7EB9-3A0601B5B5AF',
      name: 'No Position Available',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'F3369599-1749-428B-A35D-562F92782E1C',
      name: 'Submitted application to BC PNP',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: 'B93E7BF6-5F2B-43FD-B4B7-58C42AA02BFA',
      name: 'Applicant Ready for Job Search',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'EAD2E076-DF00-4DAB-A0CC-5A7F0BAFC51A',
      name: 'Referred to NCAS',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'F004F837-3357-416B-918E-651BD6FAECB5',
      name: 'Referral Acknowledged/Reviewed',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '06E2D762-05BA-4667-93D2-7843D3CF9FC5',
      name: 'Completed NCAS',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'DA06889E-55A1-4FF2-9984-80AE23D7E44B',
      name: 'Completed English Language Requirement',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'DA813B28-F617-4B5C-8E05-84F0AE3C9429',
      name: 'Sent Second Steps document to candidate',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '18AA32C3-A6A4-4431-8283-89931C141FDE',
      name: 'BCCNM Full Licence RN',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '4189CA04-C1E1-4C22-9D6B-8AFD80130313',
      name: 'Referred to Registration Exam',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'B0D38AA5-B776-4033-97F7-9894E9B33A3C',
      name: 'NCLEX – Passed',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'CAA18ECD-FEA5-459E-AF27-BCA15AC26133',
      name: 'Received Work Permit Approval Letter',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '8024ED3A-803F-4E34-9934-C29565DAAF63',
      name: 'Referred to Additional Education',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '0D6BCFE1-FB00-45CB-A9C6-C6A53DA12E62',
      name: 'NCLEX – Written',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '59263418-77EA-411F-894D-C84B5E1F710F',
      name: 'Completed Additional Education',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: '3EF75425-42EB-4CC2-8A27-C9726F6F55FA',
      name: 'Received Confirmation of Nomination',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '897156C7-958C-4EC0-879A-ED4943AF7B72',
      name: 'Submitted Documents (NNAS Application in Review)',
      category: 'IEN Licensing/Registration Process',
      'process-related': false,
    },
    {
      id: 'F84A4167-A636-4B21-977C-F11AEFC486AF',
      name: 'Withdrew from IEN program',
      category: 'IEN Licensing/Registration Process',
      'process-related': true,
    },
    {
      id: 'F2008E2F-5F44-4F4C-80B4-F4AD284E9938',
      name: 'Submitted Work Permit Application',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '1651CAD1-1E56-4C79-92CE-F548AD9EC52C',
      name: 'Sent employer documents to HMBC',
      category: 'BC PNP Process',
      'process-related': false,
    },
    {
      id: '7B97462B-8600-41F5-AAFD-3672B38C8C85',
      name: 'No position available',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '10277492-D10A-4EBD-9F50-39F4BE9D05F7',
      name: 'HA was not interested',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '049E5172-578D-49CE-BC0D-631C4FC1965C',
      name: 'Job competition cancelled',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: '009761C9-A857-4E40-978A-9CBCC6F94E35',
      name: 'Candidate withdrew from the job competition',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
    {
      id: 'E26EC530-2019-44FC-9784-D565BDD3FFDE',
      name: 'Job offer accepted',
      category: 'IEN Recruitment Process',
      'process-related': false,
    },
  ];

  private async addMilestones(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "ien_applicant_status";
    `);

    await Promise.all(
      this.milestones
        .map(({ id, name, category }) => `('${id}', '${name}', '${category}', '${name}')`)
        .map(values =>
          queryRunner.query(`
          INSERT INTO "ien_applicant_status" (id, status, category, full_name) VALUES ${values};
        `),
        ),
    );
  }

  private async changeStatusIdToUuid(queryRunner: QueryRunner): Promise<void> {
    // remove constraints related to status.id
    await queryRunner.query(
      // applicant.status_id => status.id
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT IF EXISTS "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(
      // audit.status_id -> status.id
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT IF EXISTS "FK_167d0e7e6a4a4c1cab226938914"`,
    );
    await queryRunner.query(
      //status.parent_id -> status.id
      `ALTER TABLE "ien_applicant_status" DROP CONSTRAINT IF EXISTS "FK_9fe541de3226e5de1e5f0219f0f"`,
    );

    // Clear old applicant statuses to make way for new ones.
    await queryRunner.query(`
      UPDATE "ien_applicants" SET status_id = NULL;
    `);

    // Applicant status audits will need to be deleted because they will be referencing status ids that do not exist
    await queryRunner.query(`
      DELETE FROM "ien_applicant_status_audit";
    `);

    // Applicant statuses need to be deleted because we do not have a mapping between the current ones and ones with
    // new ids
    await queryRunner.query(`
      DELETE FROM "ien_applicant_status";
    `);

    await queryRunner.dropPrimaryKey('ien_applicant_status');

    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status" DROP COLUMN IF EXISTS "id";
    `);
    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'uuid',
        name: 'id',
        isPrimary: true,
        isNullable: false,
      }),
    );
    await queryRunner.query(`
      ALTER TABLE "ien_applicants" DROP COLUMN IF EXISTS "status_id";
    `);
    await queryRunner.addColumn(
      'ien_applicants',
      new TableColumn({
        type: 'uuid',
        name: 'status_id',
        isNullable: true,
      }),
    );
    await queryRunner.query(`
      ALTER TABLE "ien_applicant_status_audit" DROP COLUMN IF EXISTS "status_id";
    `);
    await queryRunner.addColumn(
      'ien_applicant_status_audit',
      new TableColumn({
        type: 'uuid',
        name: 'status_id',
        isNullable: true,
      }),
    );

    // restore fk constraints related to status.id
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.changeStatusIdToUuid(queryRunner);

    if (!(await queryRunner.hasColumn('ien_applicant_status', 'category'))) {
      await queryRunner.addColumn(
        'ien_applicant_status',
        new TableColumn({
          type: 'varchar',
          length: '256',
          isNullable: true,
          name: 'category',
        }),
      );
    }

    await queryRunner.query(`ALTER TABLE "ien_applicants" DROP COLUMN IF EXISTS "applicant_id";`);
    await queryRunner.addColumn(
      'ien_applicants',
      new TableColumn({
        type: 'uuid',
        name: 'applicant_id',
        isNullable: true,
      }),
    );

    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" DROP COLUMN IF EXISTS "applicant_id";`,
    );
    await queryRunner.addColumn(
      'ien_applicant_status_audit',
      new TableColumn({
        type: 'uuid',
        name: 'applicant_id',
        isNullable: false,
      }),
    );

    await this.addMilestones(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // remove fk constraints related to status.id
    await queryRunner.query(
      // applicant.status_id => status.id
      `ALTER TABLE "ien_applicants" DROP CONSTRAINT IF EXISTS "FK_2a4f42fa3db57d0a519036e86f3"`,
    );
    await queryRunner.query(
      // audit.status_id -> status.id
      `ALTER TABLE "ien_applicant_status_audit" DROP CONSTRAINT IF EXISTS "FK_167d0e7e6a4a4c1cab226938914"`,
    );

    await queryRunner.query(`DELETE FROM "ien_applicant_status"`);

    // milestones - drop new id column, then rename the old one.
    if (await queryRunner.hasColumn('ien_applicant_status', 'id')) {
      await queryRunner.dropColumn('ien_applicant_status', 'id');
    }
    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'integer',
        name: 'id',
        isPrimary: true,
        isNullable: true,
      }),
    );

    // applicants - drop new id column, then rename the old one.
    if (await queryRunner.hasColumn('ien_applicant_status', 'applicant_id')) {
      await queryRunner.dropColumn('ien_applicant_status', 'applicant_id');
    }
    await queryRunner.addColumn(
      'ien_applicant_status',
      new TableColumn({
        type: 'integer',
        name: 'applicant_id',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'ien_applicants',
      'status_id',
      new TableColumn({
        type: 'integer',
        name: 'status_id',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'ien_applicant_status_audit',
      'status_id',
      new TableColumn({
        type: 'integer',
        name: 'status_id',
        isNullable: true,
      }),
    );

    // restore fk constraints
    await queryRunner.query(
      `ALTER TABLE "ien_applicants" ADD CONSTRAINT "FK_2a4f42fa3db57d0a519036e86f3" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status_audit" ADD CONSTRAINT "FK_167d0e7e6a4a4c1cab226938914" FOREIGN KEY ("status_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ien_applicant_status" ADD CONSTRAINT "FK_9fe541de3226e5de1e5f0219f0f" FOREIGN KEY ("parent_id") REFERENCES "ien_applicant_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
