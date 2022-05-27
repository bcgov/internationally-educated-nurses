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
          sum(ph) as phillipines,
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
          sum(phillipines) as phillipines,
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
