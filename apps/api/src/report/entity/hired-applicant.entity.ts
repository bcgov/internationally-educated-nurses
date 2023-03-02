import { ViewColumn, ViewEntity } from 'typeorm';

// the expression is given by reference
// because we don't sync schema and the view table should have been created by a migration
@ViewEntity({
  name: 'hired_applicant',
  expression: `
    SELECT
      a.id,
      min(ia.registration_date) AS registered_at,
      max(a.hired_at) AS hired_at,
      max(a.withdrew_at) AS withdrew_at,
      ihp.title AS ha
    FROM (
      (
        SELECT
          iasa.applicant_id AS id,
          max(iasa.start_date) AS hired_at,
          CAST(NULL AS date) AS withdrew_at,
          iasa.job_id AS job_id
        FROM public.ien_applicant_status_audit iasa
        LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
        WHERE ias.id = '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2'
        GROUP BY iasa.applicant_id, iasa.job_id
      )
      UNION ALL
      (
        SELECT
          iasa.applicant_id AS id,
          CAST(NULL AS date) AS hired_at,
          max(iasa.start_date) AS withdrew_at,
          iasa.job_id AS job_id
        FROM public.ien_applicant_status_audit iasa
        LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
        WHERE ias.id = 'f84a4167-a636-4b21-977c-f11aefc486af'
        GROUP BY iasa.applicant_id, iasa.job_id
      )
    ) as a
    LEFT JOIN ien_applicants ia ON a.id = ia.id
    LEFT JOIN ien_applicant_jobs iaj ON iaj.id = a.job_id
    LEFT JOIN ien_ha_pcn ihp ON ihp.id = iaj.ha_pcn_id
    GROUP BY a.id, ihp.title
  `,
})
export class HiredApplicantEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  registered_at!: Date;

  @ViewColumn()
  hired_at!: Date;

  @ViewColumn()
  withdrew_at!: Date;

  @ViewColumn()
  ha!: string;
}
