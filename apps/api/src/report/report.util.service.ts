import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidDateFormat } from 'src/common/util';
import dayjs from 'dayjs';

@Injectable()
export class ReportUtilService {
  applicantCountQuery(from: string, to: string) {
    return `
        with ien_applicants as (
          SELECT
            (registration_date::date - '${from}'::date)/28 as periods,
            COUNT(*)::integer as applicants          
          FROM public.ien_applicants
          WHERE
            registration_date::date >= '${from}' AND
            registration_date::date <= '${to}'
          GROUP BY 1
          ORDER BY 1
        )
        
        SELECT 
          (periods + 1) as period,
          applicants,
          to_char('${from}'::date + (periods*28), 'YYYY-MM-DD') as from,
          to_char('${from}'::date + (periods*28) + 27, 'YYYY-MM-DD') as to
        FROM ien_applicants;
    `;
  }

  counrtyWiseApplicantQuery(from: string, to: string) {
    return `
        WITH applicant_country AS (
          SELECT
            ien.id,
            (registration_date::date - '${from}'::date)/28 as periods,
            COALESCE((SELECT
              TRIM(BOTH '"' FROM (json_array_elements(ien_a.nursing_educations::json)->'country')::TEXT) as country
            FROM public.ien_applicants AS ien_a
            WHERE ien_a.id=ien.id
            ORDER BY CAST(TRIM(BOTH '' FROM (json_array_elements(ien_a.nursing_educations::json)->'year')::TEXT) AS INT) desc
            limit 1), 'n/a') as country
          FROM public.ien_applicants as ien
          WHERE
            ien.registration_date::date >= '${from}' AND
            ien.registration_date::date <= '${to}'
          ORDER BY periods, country
        ),
        applicant_country_filtered AS (
          SELECT 
            ac.id,
            ac.periods, 
            (
              CASE
              WHEN ac.country IN ('us', 'uk', 'ie', 'in', 'au', 'ph', 'ng', 'jm', 'ke', 'ca', 'n/a') THEN ac.country 
              ELSE 'other' 
              END
            ) as country
          FROM applicant_country as ac
        ),
        contry_wise_applicants AS (
          SELECT
            id,
            periods,
            CASE WHEN country = 'us' THEN 1 ELSE 0 END AS us,
            CASE WHEN country = 'uk' THEN 1 ELSE 0 END AS uk,
            CASE WHEN country = 'ie' THEN 1 ELSE 0 END AS ie,
            CASE WHEN country = 'au' THEN 1 ELSE 0 END AS au,
            CASE WHEN country = 'ph' THEN 1 ELSE 0 END AS ph,
            CASE WHEN country = 'in' THEN 1 ELSE 0 END AS "in",
            CASE WHEN country = 'ng' THEN 1 ELSE 0 END AS ng,
            CASE WHEN country = 'jm' THEN 1 ELSE 0 END AS jm,
            CASE WHEN country = 'ke' THEN 1 ELSE 0 END AS ke,
            CASE WHEN country = 'ca' THEN 1 ELSE 0 END AS ca,
            CASE WHEN country = 'other' THEN 1 ELSE 0 END AS other,
            CASE WHEN country = 'n/a' THEN 1 ELSE 0 END AS "n/a"
          FROM applicant_country_filtered
        ),
        period_contry_wise_applicants AS (
        SELECT
          periods+1 as period,
          to_char('${from}'::date + (periods*28), 'YYYY-MM-DD') as "from",
          to_char('${from}'::date + (periods*28) + 27, 'YYYY-MM-DD') as "to",
          sum(us) as us,
          sum(uk) as uk,
          sum(ie) as ireland,
          sum(au) as australia,
          sum(ph) as philippines,
          sum("in") as india,
          sum(ng) as nigeria,
          sum(jm) as jamaica,
          sum(ke) as kenya,
          sum(ca) as canada,
          sum(other) as other,
          sum("n/a") as "n/a",
          (sum(us)+sum(uk)+sum(ie)+sum(au)+sum(ph)+sum("in")+sum(ng)+sum(jm)+sum(ke)+sum(ca)+sum(other)+sum("n/a")) as total
        FROM contry_wise_applicants
        GROUP BY periods
        ORDER by periods
        )
        -- Let's run it again with union to add addinal columns for total
        SELECT *  FROM period_contry_wise_applicants
        UNION
        SELECT null AS period, null AS "from", null AS "to",
          sum(us) as us,
          sum(uk) as uk,
          sum(ireland) as ireland,
          sum(australia) as australia,
          sum(philippines) as philippines,
          sum(india) as india,
          sum(nigeria) as nigeria,
          sum(jamaica) as jamaica,
          sum(kenya) as kenya,
          sum(canada) as canada,
          sum(other) as other,
          sum("n/a") as "n/a",
          sum(total) as total
        FROM period_contry_wise_applicants
        ORDER BY period;    
    `;
  }

  hiredActiveWithdrawnApplicantCountQuery(from: string, to: string) {
    return `
      -- 28 hired
      -- 20 Withdrew
      WITH old_applicants AS (
        SELECT 
          applicants.id,
          applicants.registration_date,
          CASE WHEN COALESCE(ien_staus_hired.status_id, 0) > 0 THEN 1 ELSE 0 END as hired,
          CASE WHEN COALESCE(ien_staus_withdrew.status_id, 0) > 0 THEN 1 ELSE 0 END as withdrawn
        FROM public.ien_applicants as applicants
        LEFT JOIN public.ien_applicant_status_audit ien_staus_hired 
          ON ien_staus_hired.applicant_id=applicants.id AND ien_staus_hired.status_id=28 AND ien_staus_hired.start_date::date <= '${to}'
        LEFT JOIN public.ien_applicant_status_audit ien_staus_withdrew 
          ON ien_staus_withdrew.applicant_id=applicants.id AND ien_staus_withdrew.status_id=20 AND ien_staus_withdrew.start_date::date <= '${to}'
        WHERE applicants.registration_date::date < '${to}'
      ),
      report AS (
        SELECT 
          id,
          registration_date,
          CASE WHEN hired = 0 AND withdrawn = 0 THEN 1 ELSE 0 END AS active,
          CASE WHEN hired = 1 AND withdrawn = 0 THEN 1 ELSE 0 END AS hired,
          CASE WHEN withdrawn = 1 THEN 1 ELSE 0 END AS withdrawn
        FROM old_applicants
      )
      SELECT 
        'Applied before ' || to_char('${from}'::date, 'Mon DD, YYYY') || ' (OLD)' AS title,
        sum(active) AS active, sum(withdrawn) AS withdrawn, sum(hired) AS hired, count(*) AS total
        FROM report WHERE registration_date::date < '${from}'
      UNION ALL
      SELECT 
        'Applied after ' || to_char('${from}'::date, 'Mon DD, YYYY') || ' (NEW)' AS title,
        sum(active) AS active, sum(withdrawn) AS withdrawn, sum(hired) AS hired, count(*) AS total
        FROM report WHERE registration_date::date >= '${from}';
    `;
  }

  licensingStageApplicantsQuery(from: string, to: string) {
    return `
      --col01 - 'Applied to NNAS' status: 4, 5, 6
      --col02 - 'Applied to BCCNM' status: 7
      --col03 - 'Completed English Language Requirement' status: 8
      --col04 - 'Referred to NCAS' status: 9,10,11
      --col05 - 'Completed NCAS (BCCNM Assessment)' status: 12
      --col06 - 'Completed Additional Education' status: 13, 14
      --col07 - 'Referred to NCLEX' status: 15,17
      --col08 - 'NCLEX - Passed' status: 18
      --col09 - 'BCCNM Licensed - Full License' status: 19
      --col10 - 'Granted full licensure' status: 19
      --col11 - 'Granted provisional licensure' status: 16
      WITH active_applicants AS (
        SELECT
          t1.id,
          COALESCE((SELECT max(sa.status_id) FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id IN (19, 16)), 0) AS has_license
        FROM (
          SELECT 
            applicants.id,
            CASE WHEN COALESCE(ien_staus_hired.status_id, 0) > 0 THEN 1 ELSE 0 END as hired,
            CASE WHEN COALESCE(ien_staus_withdrew.status_id, 0) > 0 THEN 1 ELSE 0 END as withdrawn
          FROM public.ien_applicants as applicants
          LEFT JOIN public.ien_applicant_status_audit ien_staus_hired 
            ON ien_staus_hired.applicant_id=applicants.id AND ien_staus_hired.status_id=28 AND ien_staus_hired.start_date::date <= '${to}'
          LEFT JOIN public.ien_applicant_status_audit ien_staus_withdrew 
            ON ien_staus_withdrew.applicant_id=applicants.id AND ien_staus_withdrew.status_id=20 AND ien_staus_withdrew.start_date::date <= '${to}'
        ) as t1
        WHERE t1.hired = 0  and t1.withdrawn = 0
      ),
      period_data AS (
        SELECT
          aa.*,
          b.applicant_id,
          COALESCE(b.status_id, 0) as status_id
        FROM active_applicants aa
        LEFT JOIN LATERAL (
          SELECT 
            status_audit.applicant_id,
            status_audit.status_id
          FROM public.ien_applicant_status_audit status_audit
          LEFT JOIN public.ien_applicant_status status ON status.id=status_audit.status_id
          WHERE 
            start_date::date >= '${from}' AND
            start_date::date <= '${to}' AND
            aa.id=status_audit.applicant_id AND
            status.parent_id = 10002
          ORDER BY start_date desc
          limit 1
        ) b ON aa.id=b.applicant_id
      ),
      report AS (
        SELECT * FROM period_data 
        WHERE has_license <> 0 OR status_id <> 0
      )
      
      SELECT 'Applied to NNAS' as status, count(*) as applicants FROM report WHERE status_id IN (4,5,6) AND has_license = 0 UNION ALL
      SELECT 'Applied to BCCNM' as status, count(*) FROM report WHERE status_id IN (7) AND has_license = 0 UNION ALL
      SELECT 'Completed English Language Requirement' as status, count(*) FROM report WHERE status_id IN (8) AND has_license = 0 UNION ALL
      SELECT 'Referred to NCAS' as status, count(*) FROM report WHERE status_id IN (9,10,11) AND has_license = 0 UNION ALL
      SELECT 'Completed NCAS (BCCNM Assessment)' as status, count(*) FROM report WHERE status_id IN (12) AND has_license = 0 UNION ALL
      SELECT 'Completed Additional Education' as status, count(*) FROM report WHERE status_id IN (13,14) AND has_license = 0 UNION ALL
      SELECT 'Referred to NCLEX' as status, count(*) FROM report WHERE status_id IN (15,17) AND has_license = 0 UNION ALL
      SELECT 'NCLEX - Passed' as status, count(*) FROM report WHERE status_id IN (18) AND has_license = 0 UNION ALL
      SELECT 'BCCNM Licensed - Full License' as status, count(*) FROM report WHERE status_id IN (19) AND has_license = 19 UNION ALL
      SELECT 'Granted full licensure' as status, count(*) FROM report WHERE has_license = 19 UNION ALL
      SELECT 'Granted provisional licensure' as status, count(*) FROM report WHERE has_license = 16;
    `;
  }

  licenseApplicantsQuery(from: string, to: string) {
    return `
      WITH applicants_count AS (
        SELECT status_id, count(*) as total
        FROM public.ien_applicant_status_audit 
        WHERE 
          status_id IN (16, 19) AND
          start_date >= '${from}' AND
          start_date <= '${to}'
        GROUP BY status_id
      )
      SELECT 'Provisional License' as status, COALESCE((SELECT total FROM applicants_count WHERE status_id = 16), 0) as applicants
      UNION ALL
      SELECT 'Full License' as status, COALESCE((SELECT total FROM applicants_count WHERE status_id = 19), 0) as applicants;
    `;
  }

  applicantsInRecruitmentQuery(to: string) {
    return `
      WITH applicant_jobs AS (
        SELECT
          id,
          ha_pcn_id,
          (SELECT 
            status_id
          FROM public.ien_applicant_status_audit as status 
          WHERE status.job_id=job.id AND start_date <= '${to}'
          -- put new status restriction here (21 to 28 allowded)
          ORDER BY start_date DESC limit 1) as status_id
        FROM
          public.ien_applicant_jobs as job
      ),
      ha_status AS (
        SELECT
          status_id, count(*) applicants, ha.abbreviation
        FROM applicant_jobs LEFT JOIN public.ien_ha_pcn as ha ON ha.id=ha_pcn_id
        WHERE status_id IS NOT null
        GROUP BY ha.abbreviation, status_id
      ),
      applicant_ha_status AS (
        SELECT
        status_id,
        CASE WHEN abbreviation='FNHA' THEN applicants ELSE 0 END AS FNHA,
        CASE WHEN abbreviation='FHA' THEN applicants ELSE 0 END AS FHA,
        CASE WHEN abbreviation='IHA' THEN applicants ELSE 0 END AS IHA,
        CASE WHEN abbreviation='VIHA' THEN applicants ELSE 0 END AS VIHA,
        CASE WHEN abbreviation='NHA' THEN applicants ELSE 0 END AS NHA,
        CASE WHEN abbreviation='PVHA' THEN applicants ELSE 0 END AS PVHA,
        CASE WHEN abbreviation='PHSA' THEN applicants ELSE 0 END AS PHSA,
        CASE WHEN abbreviation='VCHA' THEN applicants ELSE 0 END AS VCHA
        --CASE WHEN abbreviation='EDU' THEN applicants ELSE 0 END AS EDU,
        --CASE WHEN abbreviation='OTR' THEN applicants ELSE 0 END AS OTR
      FROM ha_status
      ORDER BY status_id
      ),
      temp_status AS (
        SELECT id, 0 AS FNHA, 0 AS FHA, 0 AS IHA, 0 AS VIHA, 0 AS NHA, 0 AS PVHA, 0 AS PHSA, 0 AS VCHA
        FROM public.ien_applicant_status WHERE parent_id=10003 AND id IN (21,22,23,24,25,26,27,28) 
      ),
      final_data as (
        SELECT * FROM applicant_ha_status
        UNION ALL
        SELECT * FROM temp_status
      )
      SELECT status,
        FNHA as "First Nations Health",
        FHA as "Fraser Health",
        IHA as "Interior Health",
        VIHA as "Vancouver Island Health",
        NHA as "Northern Health", 
        PVHA as "Providence Health",
        PHSA as "Provincial Health Services", 
        VCHA as "Vancouver Coastal Health" 
        --EDU as Education, 
        --OTR as Other
      FROM (
        SELECT 
        status_id,
        sum(FNHA) AS FNHA,
        sum(FHA) AS FHA,
        sum(IHA) AS IHA,
        sum(VIHA) AS VIHA,
        sum(NHA) AS NHA,
        sum(PVHA) AS PVHA,
        sum(PHSA) AS PHSA,
        sum(VCHA) AS VCHA
        --sum(EDU) AS EDU,
        --sum(OTR) AS OTR
        FROM final_data
        GROUP BY status_id
      ) as t1 LEFT JOIN public.ien_applicant_status ON t1.status_id=ien_applicant_status.id;
    `;
  }

  applicantsInImmigrationQuery(to: string) {
    return `
      -- 30	"Sent First Steps document to candidate"
      -- 31	"Sent employer documents to HMBC"
      -- 32	"Submitted application to BC PNP"
      -- 33	"Received Confirmation of Nomination"
      -- 34	"Sent Second Steps document to candidate"
      -- 35	"Submitted Work Permit Application"
      -- 36	"Received Work Permit Approval Letter"
      -- 37	"Received Work Permit (Arrival in Canada)"
      WITH hired_applicants AS (
        SELECT
          sa.applicant_id, ha.abbreviation
        FROM public.ien_applicant_status_audit as sa
        JOIN public.ien_applicant_jobs job ON sa.job_id=job.id
        JOIN public.ien_ha_pcn ha ON job.ha_pcn_id=ha.id
        WHERE sa.status_id = 28 AND sa.start_date::date <= '${to}'
        GROUP BY sa.applicant_id, ha.abbreviation
      ),
      ha_status AS (
        SELECT t1.status_id, count(*) as applicants, t1.abbreviation
        FROM (
          SELECT 
            a1.applicant_id,
            a1.abbreviation,
            (
              SELECT sa.status_id
              FROM public.ien_applicant_status_audit as sa 
              WHERE sa.applicant_id=a1.applicant_id
                AND sa.status_id IN (30,31,32,33,34,35,36,37)
                AND sa.start_date <= '${to}'
              ORDER BY sa.start_date DESC limit 1
            ) as status_id
          FROM hired_applicants as a1
        ) AS t1
        WHERE t1.status_id is not null
        GROUP by t1.abbreviation, t1.status_id
      ),
      applicant_ha_status AS (
        SELECT
        status_id,
        CASE WHEN abbreviation='FNHA' THEN applicants ELSE 0 END AS FNHA,
        CASE WHEN abbreviation='FHA' THEN applicants ELSE 0 END AS FHA,
        CASE WHEN abbreviation='IHA' THEN applicants ELSE 0 END AS IHA,
        CASE WHEN abbreviation='VIHA' THEN applicants ELSE 0 END AS VIHA,
        CASE WHEN abbreviation='NHA' THEN applicants ELSE 0 END AS NHA,
        CASE WHEN abbreviation='PVHA' THEN applicants ELSE 0 END AS PVHA,
        CASE WHEN abbreviation='PHSA' THEN applicants ELSE 0 END AS PHSA,
        CASE WHEN abbreviation='VCHA' THEN applicants ELSE 0 END AS VCHA
      FROM ha_status
      ORDER BY status_id
      ),
      temp_status AS (
        SELECT id, 0 AS FNHA, 0 AS FHA, 0 AS IHA, 0 AS VIHA, 0 AS NHA, 0 AS PVHA, 0 AS PHSA, 0 AS VCHA
        FROM public.ien_applicant_status WHERE parent_id=10004 AND id IN (30,31,32,33,34,35,36,37)
      ),
      final_data as (
        SELECT * FROM applicant_ha_status
        UNION ALL
        SELECT * FROM temp_status
      )
      
      SELECT status,
        FNHA as "First Nations Health",
        FHA as "Fraser Health",
        IHA as "Interior Health",
        VIHA as "Vancouver Island Health",
        NHA as "Northern Health", 
        PVHA as "Providence Health",
        PHSA as "Provincial Health Services", 
        VCHA as "Vancouver Coastal Health"
      FROM (
        SELECT 
        status_id,
        sum(FNHA) AS FNHA,
        sum(FHA) AS FHA,
        sum(IHA) AS IHA,
        sum(VIHA) AS VIHA,
        sum(NHA) AS NHA,
        sum(PVHA) AS PVHA,
        sum(PHSA) AS PHSA,
        sum(VCHA) AS VCHA
        FROM final_data
        GROUP BY status_id
      ) as t1 LEFT JOIN public.ien_applicant_status ON t1.status_id=ien_applicant_status.id;
    `;
  }

  _isValidDateValue(date: string) {
    if (date && !isValidDateFormat(date)) {
      throw new BadRequestException(
        `${date} is not a validate date, Please provide date in YYYY-MM-DD format.`,
      );
    }
  }

  _prepareDefaultRow(i: number, from: string, defaultData: object) {
    return {
      period: i,
      from: dayjs(from)
        .add((i - 1) * 28, 'day')
        .format('YYYY-MM-DD'),
      to: dayjs(from)
        .add((i - 1) * 28 + 27, 'day')
        .format('YYYY-MM-DD'),
      ...defaultData,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _addMissingPeriodWithDefaultData(defaultData: object, data: any, from: string, to: string) {
    const result = [];
    const days = dayjs(to).diff(dayjs(from), 'day');
    let requestedPeriods = Math.abs(Math.ceil(days / 28));
    if (days % 28 === 0) {
      requestedPeriods += 1;
    }
    let i = 1;
    let temp = data.shift();
    while (i <= requestedPeriods) {
      if (temp?.period === i) {
        result.push(temp);
        temp = data.shift();
      } else {
        // If period data missing, Add it with default data
        result.push(this._prepareDefaultRow(i, from, defaultData));
      }
      i++;
      if (i > requestedPeriods && temp?.period === null) {
        result.push(temp);
      }
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _updateLastPeriodToDate(result: any, to: string, additinalRow = 0) {
    /**
     * additinalRow:
     * In report we are adding additional rows like total or notes, That needs to be skipped to identifing last period data.
     */
    if (result.length) {
      const lastPeriodEndDate = result[result.length - (1 + additinalRow)].to;
      if (dayjs(lastPeriodEndDate).isAfter(dayjs(to), 'day')) {
        result[result.length - (1 + additinalRow)].to = dayjs(to).format('YYYY-MM-DD');
      }
    }
  }
}
