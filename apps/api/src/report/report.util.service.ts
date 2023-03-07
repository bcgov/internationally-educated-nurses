import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { STATUS, StatusCategory } from '@ien/common';
import { isValidDateFormat } from 'src/common/util';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { PERIOD_START_DATE } from './report.service';

@Injectable()
export class ReportUtilService {
  nil_uuid = '00000000-0000-0000-0000-000000000000';

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

  countryWiseApplicantQuery(from: string, to: string) {
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
        country_wise_applicants AS (
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
        period_country_wise_applicants AS (
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
        FROM country_wise_applicants
        GROUP BY periods
        ORDER by periods
        )
        -- Run it again with union to add additional columns for total
        SELECT *  FROM period_country_wise_applicants
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
        FROM period_country_wise_applicants
        ORDER BY period;    
    `;
  }

  /*
  Report 3
  SQL query explains:
  Here we are counting active, hired, and withdrawn application TO date.

  withdrawn_applicants:
    First, we will list down all the applicants who withdraw from the process(till TO date).
  reactive_applicants:
    Based on the withdrawal list, Let's try to get the latest milestone other than withdrawal to mark as re-active.
  hired_applicants:
    Let's find hired applicants based on the milestone 28.
    If a candidate withdraws any time during the process, in this case, the hire date must be greater than the withdrawal date.
  applicants:
    Let's add hired, withdrawn, or reactive to each applicant row.
  report:
    Few conditions that need to check to identify such value(hired, withdrawal, and re-active).
    Like hired applicants are one who may get withdrawn but later re-active, or not withdrawn from the process at all.

  UNION ALL
    We have to identify two kinds of records stat,
    One before {from} date and One after {from} date. that's why UNION ALL.
  */
  hiredActiveWithdrawnApplicantCountQuery(
    statuses: Record<string, string>,
    from: string,
    to: string,
  ) {
    return `
      WITH withdrawn_applicants AS (
        SELECT a.applicant_id, max(a.start_date) as start_date
        FROM public.ien_applicant_status_audit a
        LEFT JOIN public.ien_status_reasons r ON a.reason_id = r.id 
        WHERE
          ( a.status_id = '${statuses[STATUS.WITHDREW_FROM_PROGRAM]}' OR
            (a.status_id = '${
              statuses[STATUS.WITHDREW_FROM_COMPETITION]
            }' AND r.name ILIKE 'withdrew from ien program')
          ) 
          AND a.start_date::date <= '${to}'
        GROUP BY a.applicant_id
      ), reactive_applicants AS (
        SELECT wa.applicant_id, min(ien.start_date) as start_date
        FROM withdrawn_applicants wa
        INNER JOIN public.ien_applicant_status_audit ien ON wa.applicant_id = ien.applicant_id
        LEFT JOIN public.ien_status_reasons r ON ien.reason_id = r.id
        WHERE ien.start_date::date >= wa.start_date
          AND ien.start_date::date <= '${to}'
          AND ien.status_id != '${statuses[STATUS.WITHDREW_FROM_PROGRAM]}'
          AND r.name NOT ILIKE 'withdrew from ien program'
        GROUP BY wa.applicant_id
      ), hired_applicants AS (
        SELECT ien.applicant_id, max(ien.start_date) as start_date
        FROM public.ien_applicant_status_audit ien
        LEFT JOIN withdrawn_applicants wa ON ien.applicant_id=wa.applicant_id
        WHERE ien.status_id = '${statuses[STATUS.JOB_OFFER_ACCEPTED]}' 
          AND ien.start_date::date <= '${to}' 
          AND (wa.start_date IS null OR ien.start_date >= wa.start_date)
        GROUP BY ien.applicant_id
      ), applicants AS (
        SELECT
            applicants.id,
            applicants.registration_date,
            CASE WHEN ha.start_date IS null THEN 0 ELSE 1 END AS is_hired,
		  	    CASE WHEN wa.start_date IS null THEN 0 ELSE 1 END AS is_withdrawn,
          	CASE WHEN ra.start_date IS null THEN 0 ELSE 1 END AS is_reactive
        FROM public.ien_applicants as applicants
        LEFT JOIN hired_applicants ha ON ha.applicant_id=applicants.id
        LEFT JOIN withdrawn_applicants wa ON wa.applicant_id=applicants.id
        LEFT JOIN reactive_applicants ra ON ra.applicant_id=applicants.id
        WHERE applicants.registration_date::date < '${to}'
      ), report AS (
        SELECT 
          id,
          registration_date,
          CASE WHEN is_hired = 0 AND (is_withdrawn = 0 OR is_reactive = 1) THEN 1 ELSE 0 END AS active,
          CASE WHEN is_hired = 1 THEN 1 ELSE 0 END AS hired,
          CASE WHEN is_withdrawn = 1 AND is_reactive = 0 AND is_hired = 0 THEN 1 ELSE 0 END AS withdrawn
        FROM applicants
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

  /*
  Report 4
  List applicants who are in licensing stage between FROM and TO date.
  Here Granted full/provisional licensure count contain applicants who get a license during or before the given period.
  If issued license before given period and applicant still active during the period, we will count in full/provisional licensure row.

  SQL query explains:
  active_applicants:
    Let's find active applicants first.
    Let's find the applicant's latest status from the (INTAKE, , and 10003) category(Ignoring immigration category).
      If the applicant withdrawal then-latest status must be withdrawn,
      If the applicant is hired then-latest status must be hired only(from 10001, 10002, and 10003 categories)
      has_license: during this process, we are capturing provisional/full license detail too
    From the final result lets filter only active applicants (t1.hired_or_withdrawn = 0)
  period_data:
    Let's find the latest status of the "licensing" category
    We know all the active applicants, Let's find the latest status for the given duration(FROM and TO date).
    "active_applicants LEFT JOIN licensing_latest_status during FROM and TO date"
    We have a total count as active applicants, LEFT JOIN helps to distribute that to each licensing milestone.
  report:
    has_license <> 0 OR status_id <> 0
    It means each applicant should have a license or any of the licensing milestones to count in this report.
  
  UNION ALL
    At the start of the query, we have identified stages in licensing stage(which contains a single or group of milestones).
    Let's find each of the rows separatly from the "report" result and UNION them ALL to generate report format.
  */
  licensingStageApplicantsQuery(
    statuses: Record<string, string>,
    from: string,
    to: string,
    //getNewProcessApplicants = false,
  ) {
    return `
      WITH active_applicants AS (
        SELECT
          t1.*,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '${
              statuses[STATUS.BCCNM_FULL_LICENCE_LPN]
            }'
          ) AS full_lpn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '${
              statuses[STATUS.BCCNM_FULL_LICENSE_RN]
            }'
          ) AS full_rn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '${
              statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_LPN]
            }'
          ) AS prov_lpn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '${
              statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_RN]
            }'
          ) AS prov_rn
        FROM (
          SELECT 
          applicants.id,
          CASE 
            WHEN 
              COALESCE(
                (
                  SELECT ien_status.status_id 
                  FROM public.ien_applicant_status_audit ien_status
                  LEFT JOIN public.ien_applicant_status status ON status.id = ien_status.status_id
                  WHERE
                    ien_status.applicant_id = applicants.id AND ien_status.start_date::date <= '${to}' AND
                    status.category IN ('${StatusCategory.LICENSING_REGISTRATION}', '${
      StatusCategory.RECRUITMENT
    }')
                  ORDER BY ien_status.start_date DESC, ien_status.updated_date DESC
                  LIMIT 1
                ),
                '${this.nil_uuid}'
              ) IN ('${statuses[STATUS.WITHDREW_FROM_PROGRAM]}', '${
      statuses[STATUS.JOB_OFFER_ACCEPTED]
    }') 
            THEN 1
            ELSE 0 
          END as hired_or_withdrawn
          FROM public.ien_applicants as applicants
        ) as t1
        WHERE t1.hired_or_withdrawn = 0
      ),
      period_data AS (
        SELECT
          aa.*,
          b.applicant_id,
          b.status_id as status_id
        FROM active_applicants aa
        LEFT JOIN LATERAL (
          SELECT 
            status_audit.applicant_id,
            status_audit.status_id
          FROM public.ien_applicant_status_audit status_audit
          LEFT JOIN public.ien_applicant_status status ON status.id = status_audit.status_id
          WHERE 
            start_date::date >= '${from}' AND
            start_date::date <= '${to}' AND
            aa.id = status_audit.applicant_id AND
            status.category = '${StatusCategory.LICENSING_REGISTRATION}'
          ORDER BY start_date desc, updated_date desc
          limit 1
        ) b ON aa.id=b.applicant_id
      ),
      report AS (
        SELECT * FROM period_data WHERE status_id IS NOT NULL
      )
      
      SELECT 'Applied to NNAS' as status, count(*) as applicants
      FROM report WHERE status_id IN (
        '${statuses[STATUS.APPLIED_TO_NNAS]}',
        '${statuses[STATUS.SUBMITTED_DOCUMENTS]}',
        '${statuses[STATUS.RECEIVED_NNAS_REPORT]}'
      ) UNION ALL
      SELECT 'Applied to BCCNM' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.APPLIED_TO_BCCNM]}' UNION ALL
      
      SELECT 'Completed English Language Requirement' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.COMPLETED_LANGUAGE_REQUIREMENT]}' UNION ALL
      
      SELECT 'Referred to NCAS' as status, count(*)
      FROM report WHERE status_id IN (
        '${statuses[STATUS.REFERRED_TO_NCAS]}',
        '${statuses[STATUS.COMPLETED_CBA]}',
        '${statuses[STATUS.COMPLETED_SLA]}'
      ) UNION ALL
      
      SELECT 'Completed NCAS' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.COMPLETED_NCAS]}' UNION ALL
      
      SELECT 'Completed Additional Education' as status, count(*)
      FROM report WHERE status_id IN (
        '${statuses[STATUS.REFERRED_TO_ADDITIONAL_EDUCTION]}',
        '${statuses[STATUS.COMPLETED_ADDITIONAL_EDUCATION]}'
      ) UNION ALL

      SELECT 'NCLEX - Written' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.NCLEX_WRITTEN]}' UNION ALL
      
      SELECT 'NCLEX - Passed' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.NCLEX_PASSED]}' UNION ALL
      
      SELECT 'REx-PN – Written' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REX_PN_WRITTEN]}' UNION ALL
      
      SELECT 'REx-PN – Passed' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REX_PN_PASSED]}' UNION ALL
      
      SELECT 'BCCNM Full Licence LPN' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.BCCNM_FULL_LICENCE_LPN]}' UNION ALL
      
      SELECT 'BCCNM Full Licence RN' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.BCCNM_FULL_LICENSE_RN]}' UNION ALL
      
      SELECT 'BCCNM Provisional Licence LPN' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_LPN]}' UNION ALL
      
      SELECT 'BCCNM Provisional Licence RN' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_RN]}' UNION ALL
      
      SELECT 'Referred for registration exam' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_REGISTRATION_EXAM]}' UNION ALL
      
      SELECT 'Registered as an HCA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REGISTERED_AS_AN_HCA]}' UNION ALL
      
      SELECT 'Registration Journey Complete' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REGISTRATION_JOURNEY_COMPLETED]}' UNION ALL
      
      SELECT 'Withdrew from IEN program' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.WITHDREW_FROM_PROGRAM]}' UNION ALL
      
      SELECT 'Applicant ready for job search' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.READY_FOR_JOB_SEARCH]}' UNION ALL
      
      SELECT 'Applicant Referred to FNHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_FNHA]}' UNION ALL
        
      SELECT 'Applicant Referred to FHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_FHA]}' UNION ALL
        
      SELECT 'Applicant Referred to IHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_IHA]}' UNION ALL
        
      SELECT 'Applicant Referred to NHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_NHA]}' UNION ALL
        
      SELECT 'Applicant Referred to PHC' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_PHC]}' UNION ALL
        
      SELECT 'Applicant Referred to PHSA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_PHSA]}' UNION ALL
        
      SELECT 'Applicant Referred to VCHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_VCHA]}' UNION ALL
        
      SELECT 'Applicant Referred to VIHA' as status, count(*)
      FROM report WHERE status_id = '${statuses[STATUS.REFERRED_TO_VIHA]}' UNION ALL
             
      SELECT 'Granted full licensure' as status, count(*)
      FROM report WHERE (full_rn + full_lpn) > 0 UNION ALL
      SELECT 'Granted provisional licensure' as status, count(*)
      FROM report WHERE (prov_rn + prov_lpn) > 0 and (full_rn + full_lpn) = 0;
      `;
  }

  licenseApplicantsQuery(statuses: Record<string, string>, from: string, to: string) {
    return `
       WITH active_applicants AS (
        SELECT
          t1.*
        FROM (
          SELECT 
          applicants.id,
          CASE 
            WHEN 
              COALESCE(
                (
                  SELECT ien_status.status_id 
                  FROM public.ien_applicant_status_audit ien_status
                  LEFT JOIN public.ien_applicant_status status ON status.id = ien_status.status_id
                  WHERE
                    ien_status.applicant_id = applicants.id AND ien_status.start_date::date <= '${to}' AND
                    status.category IN ('${StatusCategory.LICENSING_REGISTRATION}', '${
      StatusCategory.RECRUITMENT
    }')
                  ORDER BY ien_status.start_date DESC, ien_status.updated_date DESC
                  LIMIT 1
                ),
                '${this.nil_uuid}'
              ) IN ('${statuses[STATUS.WITHDREW_FROM_PROGRAM]}', '${
      statuses[STATUS.JOB_OFFER_ACCEPTED]
    }') 
            THEN 0
            ELSE 1 
          END as active
          FROM public.ien_applicants as applicants
        ) as t1
      ), full_lpn AS (
        SELECT DISTINCT iasa.applicant_id
        FROM public.ien_applicant_status_audit iasa 
        INNER JOIN active_applicants aa ON aa.id = iasa.applicant_id
        WHERE 
          iasa.status_id = '${statuses[STATUS.BCCNM_FULL_LICENCE_LPN]}' AND
          iasa.start_date <= '${to}' AND
          iasa.start_date >= '${from}' AND
          aa.active = 1
      ),
      full_rn AS (
        SELECT DISTINCT iasa.applicant_id
        FROM public.ien_applicant_status_audit iasa
        INNER JOIN active_applicants aa ON aa.id = iasa.applicant_id
        WHERE 
          iasa.status_id = '${statuses[STATUS.BCCNM_FULL_LICENSE_RN]}' AND
          iasa.start_date <= '${to}' AND
          iasa.start_date >= '${from}' AND
          aa.active = 1
      ),
      provisional_lpn AS (
        SELECT DISTINCT iasa.applicant_id
        FROM public.ien_applicant_status_audit iasa
        INNER JOIN active_applicants aa ON aa.id = iasa.applicant_id
        WHERE 
          iasa.status_id = '${statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_LPN]}' AND
          iasa.start_date <= '${to}' AND
          iasa.start_date >= '${from}' AND
          aa.active = 1
      ),
      provisional_rn AS (
        SELECT DISTINCT iasa.applicant_id
        FROM public.ien_applicant_status_audit iasa
        INNER JOIN active_applicants aa ON aa.id = iasa.applicant_id
        WHERE 
          iasa.status_id = '${statuses[STATUS.BCCNM_PROVISIONAL_LICENSE_RN]}' AND
          iasa.start_date <= '${to}' AND
          iasa.start_date >= '${from}' AND
          aa.active = 1
      ),
      hca AS (
        SELECT DISTINCT iasa.applicant_id
        FROM public.ien_applicant_status_audit iasa
        INNER JOIN active_applicants aa ON aa.id = iasa.applicant_id
        WHERE 
          iasa.status_id = '${statuses[STATUS.REGISTERED_AS_AN_HCA]}' AND
          iasa.start_date <= '${to}' AND
          iasa.start_date >= '${from}' AND
          aa.active = 1
      )
      
      SELECT 'BCCNM Provisional Licence LPN' AS status, count(*) AS applicant_count FROM provisional_lpn UNION ALL
      SELECT 'BCCNM Provisional Licence RN' AS status, count(*) AS applicant_count FROM provisional_rn UNION ALL 
      SELECT 'BCCNM Full Licence LPN' AS status, count(*) AS applicant_count FROM full_lpn UNION ALL
      SELECT 'BCCNM Full Licence RN' AS status, count(*) AS applicant_count FROM full_rn UNION ALL
      SELECT 'Registered as an HCA' AS status, count(*) AS applicant_count FROM hca ; 
    `;
  }

  applicantsInRecruitmentQuery(statuses: Record<string, string>, to: string) {
    return `
      WITH withdrew_hired_applicants AS (
        -- let's find candidates who were withdrew/hired in the process
        SELECT t1.* 
        FROM (
          SELECT
            ien_status.*,
            ROW_NUMBER() OVER(PARTITION BY ien_status.applicant_id ORDER BY ien_status.start_date DESC, ien_status.updated_date DESC) AS rank
          FROM public.ien_applicant_status_audit ien_status
          LEFT JOIN public.ien_applicant_status status ON status.id=ien_status.status_id
          WHERE
            ien_status.start_date::date <= '${to}' 
            AND status.category IN ('${StatusCategory.LICENSING_REGISTRATION}', '${
      StatusCategory.RECRUITMENT
    }')
            AND ien_status.status_id IN ('${statuses[STATUS.WITHDREW_FROM_PROGRAM]}', '${
      statuses[STATUS.JOB_OFFER_ACCEPTED]
    }')
        ) as t1
        WHERE t1.rank=1
      ), find_reactive_applicants AS (
        -- if applicant has any new milestone after withdrew, we will mark it as active and include in this report
        SELECT *
        FROM (
          SELECT
            wha.applicant_id,
            wha.status_id,
            wha.job_id,
            wha.start_date,
            CASE WHEN wha.status_id = '${statuses[STATUS.WITHDREW_FROM_PROGRAM]}' THEN (
              SELECT iasa.start_date FROM public.ien_applicant_status_audit iasa 
              WHERE
                iasa.applicant_id = wha.applicant_id AND iasa.status_id != '${
                  statuses[STATUS.WITHDREW_FROM_PROGRAM]
                }' AND
                (iasa.start_date > wha.start_date OR (iasa.start_date = wha.start_date AND iasa.updated_date > wha.updated_date))
              ORDER BY start_date limit 1
            ) END as next_date
          FROM withdrew_hired_applicants wha
          ) t1
        WHERE (t1.status_id='${statuses[STATUS.WITHDREW_FROM_PROGRAM]}' and t1.next_date is null) OR
          t1.status_id='${statuses[STATUS.JOB_OFFER_ACCEPTED]}'
      ),
      applicant_jobs AS (
        -- It contain all the jobs that possibly fits in this report till 'to' date filter
        -- First query contain all the active applicants status
        SELECT
          id,
          ha_pcn_id,
          (SELECT status_id FROM public.ien_applicant_status_audit as status 
            WHERE status.job_id=job.id AND start_date <= '${to}'
            -- put new status restriction here
            ORDER BY start_date DESC, updated_date DESC limit 1) as status_id,
          applicant_id
        FROM
          public.ien_applicant_jobs as job
        WHERE job.applicant_id NOT IN (SELECT applicant_id FROM find_reactive_applicants)
        UNION ALL
        -- second query contain all the hired applicants final status.
        -- It select a job competetion in which applicant hired and drop all the other ones
        SELECT
          job.id,
          job.ha_pcn_id,
          fra.status_id,
          job.applicant_id
        FROM
          public.ien_applicant_jobs as job
        LEFT JOIN find_reactive_applicants fra ON fra.job_id = job.id
        WHERE fra.job_id is not null
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
          CASE WHEN abbreviation='PHC' THEN applicants ELSE 0 END AS PHC,
          CASE WHEN abbreviation='PHSA' THEN applicants ELSE 0 END AS PHSA,
          CASE WHEN abbreviation='VCHA' THEN applicants ELSE 0 END AS VCHA
        FROM ha_status
        ORDER BY status_id
        ),
        final_data as (
        SELECT * FROM applicant_ha_status
        UNION ALL
        SELECT id, 0 AS FNHA, 0 AS FHA, 0 AS IHA, 0 AS VIHA, 0 AS NHA, 0 AS PHC, 0 AS PHSA, 0 AS VCHA
        FROM public.ien_applicant_status WHERE category = '${StatusCategory.RECRUITMENT}' AND 
        id IN (
          '${statuses[STATUS.REFERRAL_ACKNOWLEDGED]}',
          '${statuses[STATUS.PRE_SCREEN_PASSED]}',
          '${statuses[STATUS.PRE_SCREEN_NOT_PASSED]}',
          '${statuses[STATUS.INTERVIEW_PASSED]}',
          '${statuses[STATUS.INTERVIEW_NOT_PASSED]}',
          '${statuses[STATUS.REFERENCE_CHECK_PASSED]}',
          '${statuses[STATUS.REFERENCE_CHECK_NOT_PASSED]}',
          '${statuses[STATUS.JOB_OFFER_NOT_ACCEPTED]}',
          '${statuses[STATUS.JOB_COMPETITION_CANCELLED]}',
          '${statuses[STATUS.HA_NOT_INTERESTED]}',
          '${statuses[STATUS.NO_POSITION_AVAILABLE]}',
          '${statuses[STATUS.WITHDREW_FROM_COMPETITION]}',
          '${statuses[STATUS.JOB_OFFER_ACCEPTED]}'
          )
        )
        SELECT status,
          FNHA as "First Nations Health",
          FHA as "Fraser Health",
          IHA as "Interior Health",
          VIHA as "Vancouver Island Health",
          NHA as "Northern Health", 
          PHC as "Providence Health Care",
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
          sum(PHC) AS PHC,
          sum(PHSA) AS PHSA,
          sum(VCHA) AS VCHA
        FROM final_data
        GROUP BY status_id
        ) as t1 LEFT JOIN public.ien_applicant_status ON t1.status_id=ien_applicant_status.id;
    `;
  }

  applicantsInImmigrationQuery(statuses: Record<string, string>, to: string) {
    return `
      WITH hired_applicants AS (
        SELECT
          sa.applicant_id, ha.abbreviation
        FROM public.ien_applicant_status_audit as sa
        JOIN public.ien_applicant_jobs job ON sa.job_id=job.id
        JOIN public.ien_ha_pcn ha ON job.ha_pcn_id=ha.id
        WHERE sa.status_id = '${
          statuses[STATUS.JOB_OFFER_ACCEPTED]
        }' AND sa.start_date::date <= '${to}'
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
                AND sa.status_id IN (
                  '${statuses[STATUS.SENT_FIRST_STEPS_DOCUMENT]}',
                  '${statuses[STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC]}',
                  '${statuses[STATUS.SUBMITTED_BC_PNP_APPLICATION]}',
                  '${statuses[STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION]}',
                  '${statuses[STATUS.SENT_SECOND_STEPS_DOCUMENT]}',
                  '${statuses[STATUS.SUBMITTED_WORK_PERMIT_APPLICATION]}',
                  '${statuses[STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER]}',
                  '${statuses[STATUS.RECEIVED_WORK_PERMIT]}'
                  )
                AND sa.start_date <= '${to}'
              ORDER BY sa.start_date DESC, sa.updated_date DESC
              LIMIT 1
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
        CASE WHEN abbreviation='PHC' THEN applicants ELSE 0 END AS PHC,
        CASE WHEN abbreviation='PHSA' THEN applicants ELSE 0 END AS PHSA,
        CASE WHEN abbreviation='VCHA' THEN applicants ELSE 0 END AS VCHA
      FROM ha_status
      ORDER BY status_id
      ),
      temp_status AS (
        SELECT id, 0 AS FNHA, 0 AS FHA, 0 AS IHA, 0 AS VIHA, 0 AS NHA, 0 AS PHC, 0 AS PHSA, 0 AS VCHA
        FROM public.ien_applicant_status WHERE category = '${StatusCategory.BC_PNP}' AND
        id IN (
          '${statuses[STATUS.SENT_FIRST_STEPS_DOCUMENT]}',
          '${statuses[STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC]}',
          '${statuses[STATUS.SUBMITTED_BC_PNP_APPLICATION]}',
          '${statuses[STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION]}',
          '${statuses[STATUS.SENT_SECOND_STEPS_DOCUMENT]}',
          '${statuses[STATUS.SUBMITTED_WORK_PERMIT_APPLICATION]}',
          '${statuses[STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER]}',
          '${statuses[STATUS.RECEIVED_WORK_PERMIT]}'
          )
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
        PHC as "Providence Health Care",
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
        sum(PHC) AS PHC,
        sum(PHSA) AS PHSA,
        sum(VCHA) AS VCHA
        FROM final_data
        GROUP BY status_id
      ) as t1 LEFT JOIN public.ien_applicant_status ON t1.status_id=ien_applicant_status.id;
    `;
  }

  applicantHAForCurrentPeriodFiscalQuery(
    statuses: Record<string, string>,
    periodStart: string,
    fiscalStart: string,
    to: string,
  ) {
    const startOfTotal = PERIOD_START_DATE > fiscalStart ? fiscalStart : PERIOD_START_DATE;
    const currentColumn = `current_period ${periodStart}~${to}`;
    return `
      WITH applicantReceivedWP AS (
        SELECT 
          applicant_id, max(start_date) as start_date
        FROM public.ien_applicant_status_audit
        WHERE status_id = '${statuses[STATUS.RECEIVED_WORK_PERMIT]}' AND start_date::date <= '${to}'
        GROUP BY applicant_id
      ), applicantHA AS (
        SELECT
          arwp.*,
          (
            SELECT aj.ha_pcn_id
            FROM public.ien_applicant_status_audit asa
            INNER JOIN public.ien_applicant_jobs aj on aj.id = asa.job_id
            WHERE
              arwp.applicant_id = asa.applicant_id AND
              asa.status_id = '${statuses[STATUS.JOB_OFFER_ACCEPTED]}' 
            ORDER BY asa.start_date DESC, asa.updated_date DESC 
            LIMIT 1
          ) as ha 
        FROM applicantReceivedWP arwp
      ), currentPeriod as (
        SELECT ha, count(*) as current_period
        FROM applicantHA
        WHERE 
          start_date >= '${periodStart}' AND
          start_date <= '${to}'
        GROUP BY ha
      ), currentFiscal as (
        SELECT ha, count(*) as current_fiscal
        FROM applicantHA
        WHERE 
          start_date >= '${fiscalStart}' AND
          start_date <= '${to}'
        GROUP BY ha
      ), totalToDate as (
        SELECT ha, count(*) as total
        FROM applicantHA
        WHERE start_date <= '${to}' AND start_date >= '${startOfTotal}'
        GROUP BY ha
      ), report AS (
        SELECT 
          title,
          COALESCE(currentPeriod.current_period, 0) as "${currentColumn}",
          COALESCE(currentFiscal.current_fiscal, 0) as current_fiscal,
          COALESCE(totalToDate.total, 0) as total
        FROM public.ien_ha_pcn
        LEFT JOIN currentPeriod ON currentPeriod.ha=id
        LEFT JOIN currentFiscal ON currentFiscal.ha=id
        LEFT JOIN totalToDate ON totalToDate.ha=id
        WHERE title NOT IN ('Other', 'Education')
        ORDER BY title
      )
      
      SELECT * FROM report
      UNION ALL
      SELECT 'Total', sum("${currentColumn}"), sum(current_fiscal), sum(total) from report;
    `;
  }

  getMilestoneIds(statuses: Record<string, string>, milestones: STATUS[]): string {
    return milestones.map(m => `'${statuses[m]}'`).join(',');
  }

  getHigherMilestoneIds(
    milestones: STATUS[],
    statuses: Record<string, string>,
    status: STATUS,
  ): string {
    const index = milestones.findIndex(m => m === status);
    return this.getMilestoneIds(statuses, index >= 0 ? milestones.slice(index + 1) : []);
  }

  extractApplicantsDataQuery(from: string, to: string, milestones: IENApplicantStatus[]) {
    const milestone_ids: string[] = [];
    const milestoneList: string[] = [];
    milestones.forEach((item: { id: string; status: string }) => {
      milestone_ids.push(`"${item.id}" date`); // It will help to create dynamic column from json object
      milestoneList.push(`to_char(x."${item.id}", 'YYYY-MM-DD') as "${item.status}"`); // Display status name instead of id
    });
    const applicantColumns: string[] = [
      'a.id AS "Applicant ID"',
      'a.registration_date AS "Registration Date"',
      `(SELECT string_agg(t->>'name', ',') FROM jsonb_array_elements(a.assigned_to::jsonb) AS x(t)) AS "Assigned to"`,
      'a.country_of_residence AS "Country of Residence"',
      'a.pr_status as "PR Status"',
      'CAST(a.nursing_educations AS TEXT) AS "Nursing Education"',
      `(SELECT string_agg(trim(x::text, '"'), ',')
         FROM jsonb_array_elements(a.country_of_citizenship::jsonb) AS x
       ) AS "Country of Citizenship"`,
      `(SELECT string_agg(replace(ias.status, 'Applicant Referred to', ''), ',') 
         FROM ien_applicant_status_audit sa
         INNER JOIN ien_applicant_status ias ON ias.id = sa.status_id
         WHERE sa.applicant_id = a.id and ias.status ILIKE 'applicant referred to%'
         GROUP BY sa.applicant_id
       ) AS "Referred Health Authority"`,
    ];
    return `
    SELECT ${applicantColumns.join(',')}, ${milestoneList.join(',')}
    FROM public.ien_applicants as a
    LEFT JOIN
      jsonb_to_record(
      (SELECT jsonb_build_object('applicant_id',t.applicant_id) || jsonb_object_agg(t.status_id::text, t.start_date) AS data
      FROM public.ien_applicant_status_audit t
      WHERE t.applicant_id=a.id
      GROUP by t.applicant_id)
      ) as x("applicant_id" uuid, ${milestone_ids.join(',')}) ON x.applicant_id=a.id
    WHERE a.registration_date::date >= '${from}' AND a.registration_date::date <= '${to}'
    ORDER BY a.registration_date DESC
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
  _updateLastPeriodToDate(result: any, to: string, additionalRow = 0) {
    /**
     * additional row:
     * In report, we are adding additional rows like total or notes, That needs to be skipped to identifying last period
     * data.
     */
    if (result.length) {
      const lastPeriodEndDate = result[result.length - (1 + additionalRow)].to;
      if (dayjs(lastPeriodEndDate).isAfter(dayjs(to), 'day')) {
        result[result.length - (1 + additionalRow)].to = dayjs(to).format('YYYY-MM-DD');
      }
    }
  }
}
