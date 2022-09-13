import dayjs from 'dayjs';
import _ from 'lodash';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropApplicantHealthAuthorityColumn1662739359109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // generate referral milestones from health_authorities
    const referrals: { id: string; status: string }[] = await queryRunner.query(`
      SELECT id, status FROM ien_applicant_status WHERE status ILIKE 'Applicant referred to%';
    `);
    const ha_pcn: { id: string; ab: string }[] = await queryRunner.query(`
      SELECT id, abbreviation AS ab FROM ien_ha_pcn;
    `);
    const haReferralMap: Record<string, string> = {};
    ha_pcn.forEach(ha => {
      const status = referrals.find(s => s.status.includes(`to ${ha.ab}`));
      if (status) {
        haReferralMap[ha.id] = status.id;
      }
    });
    const applicants: { id: string; ha: string; registration_date: string }[] =
      await queryRunner.query(`
      SELECT
        id,
        (SELECT string_agg(t->>'id', ',')
          FROM jsonb_array_elements(health_authorities::jsonb) AS x(t)
        ) AS ha,
        registration_date
      FROM 
        ien_applicants
      WHERE
        jsonb_array_length(health_authorities) > 0;
    `);
    await Promise.all(
      applicants.map(a => {
        const haList = _.uniq(a.ha.split(','));
        return haList
          .filter(ha => haReferralMap[ha])
          .map(ha =>
            queryRunner.query(`
          INSERT INTO "ien_applicant_status_audit"
            ("status_id", "applicant_id", "start_date")
          VALUES
            ('${haReferralMap[ha]}', '${a.id}', '${dayjs(a.registration_date).format(
              'YYYY-MM-DD',
            )}')
          ON CONFLICT DO NOTHING;
        `),
          );
      }),
    );

    if (await queryRunner.hasColumn('ien_applicants', 'health_authorities')) {
      await queryRunner.dropColumn('ien_applicants', 'health_authorities');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('ien_applicants', 'health_authorities'))) {
      await queryRunner.query(`ALTER TABLE "ien_applicants" ADD "health_authorities" jsonb`);
    }
  }
}
