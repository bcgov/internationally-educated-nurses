import { BadRequestException, Injectable } from '@nestjs/common';
import { isValidDateFormat } from 'src/common/util';
import dayjs from 'dayjs';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';

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
  hiredActiveWithdrawnApplicantCountQuery(from: string, to: string) {
    return `
      -- 28 hired
      -- 20 Withdrew
      WITH withdrawn_applicants AS (
        SELECT applicant_id, max(start_date) as start_date
        FROM public.ien_applicant_status_audit 
        WHERE status_id=20 
          AND start_date::date <= '${to}'
        GROUP BY applicant_id
      ), reactive_applicants AS (
        SELECT wa.applicant_id, min(ien.start_date) as start_date
        FROM withdrawn_applicants wa INNER JOIN public.ien_applicant_status_audit ien ON wa.applicant_id=ien.applicant_id
        WHERE ien.start_date::date >= wa.start_date
          AND ien.start_date::date <= '${to}'
          AND ien.status_id != 20
        GROUP BY wa.applicant_id
      ), hired_applicants AS (
        SELECT ien.applicant_id, max(ien.start_date) as start_date
        FROM public.ien_applicant_status_audit ien
        LEFT JOIN withdrawn_applicants wa ON ien.applicant_id=wa.applicant_id
        WHERE ien.status_id=28 
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
    Let's find the applicant's latest status from the (10001, 10002, and 10003) category(Ignoring immigration category).
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
          t1.*,
          COALESCE((SELECT max(sa.status_id) FROM public.ien_applicant_status_audit sa 
          WHERE sa.applicant_id=t1.id AND sa.status_id IN (19, 16)), 0) AS has_license
        FROM (
          SELECT 
          applicants.id,
          CASE 
            WHEN 
              COALESCE(
              (
                SELECT ien_status.status_id 
                FROM public.ien_applicant_status_audit ien_status
                LEFT JOIN public.ien_applicant_status status ON status.id=ien_status.status_id
                WHERE ien_status.applicant_id=applicants.id AND ien_status.start_date::date <= '${to}' AND status.parent_id IN (10001, 10002, 10003)
                ORDER BY ien_status.start_date DESC limit 1
              ),0) IN (20, 28) 
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
      final_data as (
        SELECT * FROM applicant_ha_status
        UNION ALL
        SELECT id, 0 AS FNHA, 0 AS FHA, 0 AS IHA, 0 AS VIHA, 0 AS NHA, 0 AS PVHA, 0 AS PHSA, 0 AS VCHA
        FROM public.ien_applicant_status WHERE parent_id=10003 AND id IN (21,22,23,24,25,26,27,28)
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

  applicantHAForCurrentPeriodFiscalQuery(from: string, to: string) {
    return `
      -- milestoneId 37 - Received Work Permit (Arrival in Canada)
      -- 
      WITH periods AS (
        SELECT
          to_char('${from}'::date + ((('${to}'::date - '${from}'::date)/28)*28), 'YYYY-MM-DD') as period_start
      ), applicantReceivedWP AS (
        SELECT 
          applicant_id, max(start_date) as start_date
        FROM public.ien_applicant_status_audit
        WHERE status_id=37 AND start_date::date <= '${to}'
        GROUP BY applicant_id
      ), applicantHA AS (
        SELECT
          arwp.*,
          (
            SELECT aj.ha_pcn_id 
            FROM public.ien_applicant_status_audit asa JOIN public.ien_applicant_jobs aj on aj.id=asa.job_id
            WHERE arwp.applicant_id = asa.applicant_id
            ORDER BY asa.start_date DESC
            limit 1
          ) as ha 
        FROM applicantReceivedWP arwp
      ), currentPeriod as (
      
        SELECT ha, count(*) as current_period
        FROM applicantHA
        WHERE 
          start_date >= (SELECT period_start::date FROM periods) AND
          start_date <= '${to}'
        GROUP BY ha
      ), currentFiscal as (
        SELECT ha, count(*) as current_fiscal
        FROM applicantHA
        WHERE 
          start_date >= '${from}' AND
          start_date <= '${to}'
        GROUP BY ha
      ), totalToDate as (
        SELECT ha, count(*) as total_to_date
        FROM applicantHA
        WHERE start_date <= '${to}'
        GROUP BY ha
      ), report AS (
        SELECT 
          title,
          COALESCE(currentPeriod.current_period, 0) as current_period,
          COALESCE(currentFiscal.current_fiscal, 0) as current_fiscal,
          COALESCE(totalToDate.total_to_date, 0) as total_to_date
        FROM public.ien_ha_pcn
        LEFT JOIN currentPeriod ON currentPeriod.ha=id
        LEFT JOIN currentFiscal ON currentFiscal.ha=id
        LEFT JOIN totalToDate ON totalToDate.ha=id
        WHERE title NOT IN ('Other', 'Education')
        ORDER BY title
      )
      
      SELECT * FROM report
      UNION ALL
      SELECT 'Total (up to ' || to_char('${to}'::date, 'Mon DD,YYYY') || ')', sum(current_period), sum(current_fiscal), sum(total_to_date) from report;
    `;
  }

  /*
  Report 9
  SQL query explain:
  latest_hired_withdrawal_status:
    This query will find the highest status hire/withdrew, From which we will only filter hired applicants.
    Why?: In some cases, applicant gets hired but later withdraw applications from the process. Here we have to filter out such applicants.
  hired_applicants:
    We may receive multiple Hired milestones for an applicant. This query will keep only the latest hired data.
  applicant_with_withdrawal:
    There are possibilities that hired applicant's application may be put on hold or withdrawn and then reactive again.
    This query will identify such milestone(withdrawal/Hold) for Hired(selected in the above query result) applicants.
  applicant_withdrawal_duration:
    To get duration of the withdrawal/hold milestones, we need to find a reactive date, Let's perform "reactive - withdrawal" to get the duration.
    We have only select Hired applicants, So if we have withdrawal/hold milestone then there must be a reactivate too.
  withdrawal_duration:
    In case an applicant has more than one withdrawal/hold duration during the process. This query will make a summation of it.
  start_date_of_each_stage:
    For each stack holder group there is a specific range of milestones, that helps to identify the minimum date from those groups.
    This group does not point directly to the stack holder group that we saw in the report,
    But these groups help to identify each stack holder's duration.
  stackholder_duration:
    We have a start date(minimum date) available, Now we can find duration by substracting start and end dates of any group.
  
  Now, We have collected all the data applicant-wise.
  Let's create a report format from it and find MEAN, Median, and MODE values.
  Report:
    This query will only put value in a report format so that it is easily readable.
  */
  averageTimeWithEachStackholderGroupQuery(to: string) {
    return `
      -- ONLY HIRED Applicants are selected in "Average Amount of Time" calculation with Each Stakeholder Group
      -- If we receive 2 hired state for different HA, Then we will pick only latest one
      -- One assumption that withdrwal/hold period does not overlap each other for same applicant.
        -- For developer reference
        -- ROUND(avg(average_time_to_hire), 2)::double precision as mean_value; --mean
        -- SELECT PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY some_value) FROM tbl; -- median
        -- SELECT mode() WITHIN GROUP (ORDER BY some_value) AS mode_value FROM tbl; -- mode
      
      WITH latest_hired_withdrawal_status AS (
        SELECT
          iasa.id,
          iasa.applicant_id, 
              iasa.start_date,
            iasa.status_id,
          iasa.job_id,
          iaj.ha_pcn_id as ha,
              ROW_NUMBER() OVER(PARTITION BY iasa.applicant_id ORDER BY iasa.start_date DESC) AS rank
        FROM public.ien_applicant_status_audit iasa
        LEFT JOIN public.ien_applicant_jobs iaj ON iasa.job_id=iaj.id
        WHERE iasa.status_id IN (20, 28) AND iasa.start_date::date <= '${to}'
      ), hired_applicants AS (
        SELECT applicant_id as "id", start_date as hired_date, ha, job_id
        FROM latest_hired_withdrawal_status
        WHERE rank = 1 AND status_id=28
      ), applicant_with_withdrawal AS (
        SELECT 
          DISTINCT(applicant_id) as applicant_id 
        FROM public.ien_applicant_status_audit 
        WHERE status_id=20
        AND applicant_id IN (SELECT id FROM hired_applicants)
      ), applicant_withdrawal_duration AS (
        SELECT applicant_id, next_start_at - start_date as duration
        FROM (
          SELECT *, 
            ROW_NUMBER() OVER (PARTITION BY applicant_id ORDER BY start_date) AS rn, 
            LEAD(start_date) OVER (PARTITION BY applicant_id ORDER BY start_date, created_date) AS next_start_at
          FROM public.ien_applicant_status_audit
          WHERE start_date::date <= '${to}'
          AND applicant_id IN (SELECT applicant_id FROM applicant_with_withdrawal)
        ) q
        WHERE status_id=20 AND next_start_at IS NOT null
      ), withdrawal_duration AS (
        SELECT applicant_id, sum(duration)::integer as duration
        FROM applicant_withdrawal_duration
        GROUP BY applicant_id
      ), start_date_of_each_stage AS (
        SELECT
          hired.*,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id) as milestone_start_date,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id AND asa.status_id IN (4,5,6)) as nnas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id AND asa.status_id IN (7,8,9,10,11,12)) as bccnm_ncas,
          (SELECT max(start_date) - min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id AND asa.job_id = hired.job_id) as employer_duration,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id AND asa.status_id IN (30,31,32,33,34,35) AND asa.start_date::date <= '${to}') as immigration,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id=hired.id AND asa.status_id IN (36,37,38) AND asa.start_date::date <= '${to}') as immigration_completed,
          wd.duration as withdrawal_duration
        FROM hired_applicants hired
        LEFT JOIN withdrawal_duration wd ON wd.applicant_id=hired.id
      ), stackholder_duration AS (
        SELECT
          sdoes.id,
          sdoes.ha,
          sdoes.employer_duration,
          (
          CASE
            WHEN sdoes.nnas IS NOT null THEN (
            (
              SELECT min(start_date) FROM public.ien_applicant_status_audit asa LEFT JOIN public.ien_applicant_status ien_status ON ien_status.id=asa.status_id
              WHERE asa.applicant_id=sdoes.id AND asa.start_date >= sdoes.nnas AND (asa.status_id IN (6,7,8,9,10,11,12,13,14,15,16,17,18,19) OR ien_status.parent_id IN (10003, 10004, 10005))
            ) - sdoes.nnas)
          END
          ) AS nnas_duration,
          (
          CASE
            WHEN sdoes.bccnm_ncas IS NOT null THEN (
            (
              SELECT min(start_date) FROM public.ien_applicant_status_audit asa LEFT JOIN public.ien_applicant_status ien_status ON ien_status.id=asa.status_id
              WHERE asa.applicant_id=sdoes.id AND asa.start_date >= sdoes.nnas AND (asa.status_id IN (12,13,14,15,16,17,18,19) OR ien_status.parent_id IN (10003, 10004, 10005))
            ) - sdoes.bccnm_ncas)
          END
          ) AS bccnm_ncas_duration,
          (
          CASE
            WHEN sdoes.immigration IS NOT null AND sdoes.immigration_completed IS NOT null THEN (sdoes.immigration_completed - sdoes.immigration)
            WHEN sdoes.immigration IS NOT null AND sdoes.immigration_completed IS null THEN ('${to}'::date - sdoes.immigration)
          END
          ) AS immigration_duration,
          (
          CASE
            WHEN sdoes.immigration_completed IS null THEN ('${to}'::date - sdoes.milestone_start_date)
            ELSE (sdoes.immigration_completed - sdoes.milestone_start_date)
          END
          ) - COALESCE(sdoes.withdrawal_duration, 0) AS overall,
          (
            CASE
              WHEN sdoes.nnas IS NOT NULL THEN (sdoes.hired_date - sdoes.nnas)
              ELSE (sdoes.hired_date - sdoes.milestone_start_date) END
          ) - COALESCE(sdoes.withdrawal_duration, 0) AS average_time_to_hire,
          sdoes.withdrawal_duration
        FROM start_date_of_each_stage sdoes
      ), report AS (
      SELECT
        'NNAS' as "title",
        ' ' as "HA",
        ROUND(avg(nnas_duration), 2) as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY nnas_duration) AS median_value,
        mode() WITHIN GROUP (ORDER BY nnas_duration) AS mode_value
      FROM stackholder_duration
      UNION ALL
      SELECT
        'BCCNM & NCAS',
        ' ',
        ROUND(avg(bccnm_ncas_duration), 2) as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY bccnm_ncas_duration) AS median_value,
        mode() WITHIN GROUP (ORDER BY bccnm_ncas_duration) AS mode_value
      FROM stackholder_duration
      UNION ALL
      SELECT * FROM (SELECT ' ', title, t1.mean_value, t1.median_value, t1.mode_value
      FROM public.ien_ha_pcn LEFT JOIN (
        SELECT 
        ha,
        avg(employer_duration)::double precision as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY employer_duration) AS median_value,
        mode() WITHIN GROUP (ORDER BY employer_duration) AS mode_value
        FROM stackholder_duration
        GROUP BY ha
      ) as t1 ON t1.ha=id
      WHERE title NOT IN ('Other', 'Education') ORDER BY title) as a1
      UNION ALL
      SELECT
        'Immigration',
        ' ',
        avg(immigration_duration)::double precision as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY immigration_duration) AS median_value,
        mode() WITHIN GROUP (ORDER BY immigration_duration) AS mode_value
      FROM stackholder_duration
      UNION ALL
      SELECT
        'Overall',
        ' ',
        ROUND(avg(overall), 2) as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY overall) AS median_value,
        mode() WITHIN GROUP (ORDER BY overall) AS mode_value
      FROM stackholder_duration
      UNION ALL
      SELECT
        'Average time to hire',
        ' ',
        ROUND(avg(average_time_to_hire), 2) as mean_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY average_time_to_hire) AS median_value,
        mode() WITHIN GROUP (ORDER BY average_time_to_hire) AS mode_value
      FROM stackholder_duration
      )
      SELECT title, "HA", COALESCE(mean_value, 0) as "Mean", COALESCE(median_value, 0) as "Median", COALESCE(mode_value, 0) as "Mode" FROM report;
    `;
  }

  extractApplicantsDataQuery(from: string, to: string, milestones: IENApplicantStatus[]) {
    const milestone_ids: string[] = [];
    const milestoneList: string[] = [];
    milestones.forEach((item: { id: number; status: string }) => {
      milestone_ids.push(`"${item.id}" date`); // It will help to create dynamic column from json object
      milestoneList.push(`to_char(x."${item.id}", 'YYYY-MM-DD') as "${item.status}"`); // Display status name instead of id
    });
    const applicantColumns: string[] = [
      'a.id',
      'a.applicant_id',
      `a.additional_data->'first_name' as first_name`,
      `a.additional_data->'last_name' as last_name`,
      'a.registration_date',
      'a.email_address',
      'a.phone_number',
      `(select string_agg(t->>'name', ',') from jsonb_array_elements(a.assigned_to::jsonb) as x(t)) as assigned_to`,
      'a.country_of_residence',
      'a.pr_status',
      `(select string_agg(t->>'title', ',') from jsonb_array_elements(a.health_authorities::jsonb) as x(t)) as health_authorities`,
      'CAST(a.nursing_educations AS TEXT)',
      `a.country_of_citizenship::TEXT as country_of_citizenship`,
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
    WHERE a.registration_date::date >= '${from}' AND a.registration_date::date < '${to}'
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
