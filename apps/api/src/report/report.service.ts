import { BadRequestException } from '@nestjs/common';
import { isValidDateFormat } from 'src/common/util';
import { getManager } from 'typeorm';
import dayjs from 'dayjs';

const PERIOD_START_DATE = '2021-04-01';

interface ApplicantsByPeriod {
  period: number,
  from: string;
  to: string;
  applicants: number;
}

export class ReportService {
  buildQuery(from: string, to: string) {
    let query = '';
    if (from) {
      query = `created_date::date >= '${from}'`;
    }
    if (to) {
      const tempTo = `created_date::date <= '${to}'`;
      query = query === '' ? tempTo : `${query} AND ${tempTo}`;
    }
    query = query != '' ? `WHERE ${query}` : '';
    return query;
  }

  async getCountryWiseApplicantList(from: string, to: string) {
    this.isValidDateValue(from);
    this.isValidDateValue(to);
    const query = this.buildQuery(from, to);
    const entityManager = getManager();
    const data = await entityManager.query(`
        SELECT count(id) as applicants, t2.country FROM
        (
            SELECT * FROM (
            SELECT id, TRIM(BOTH '"'
                            FROM (json_array_elements(nursing_educations::json)->'country')::TEXT) as country
            FROM public.ien_applicants
            ${query}
            ) AS t1 GROUP BY t1.id, t1.country
        ) AS t2
        WHERE t2.country IS NOT NULL
        GROUP BY t2.country
        ORDER BY applicants desc;
    `);
    return data.map((ele: { applicants: number }) => {
      ele.applicants = +ele.applicants;
      return ele;
    });
  }

  async getRegisteredApplicantList(from: string, to: string) {
    this.isValidDateValue(from);
    this.isValidDateValue(to);
    if (!from) {
      from = PERIOD_START_DATE;
    }
    if (!to) {
      to = dayjs().format("YYYY-MM-DD");
    }
    const requestedPeriods = Math.abs(Math.ceil(dayjs(to).diff(dayjs(from), 'day')/28));
    const entityManager = getManager();
    const applicantsCountSQL = `
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
        '${from}'::date + (periods*28) as from,
        '${from}'::date + (periods*28) + 27 as to
      FROM ien_applicants;
    `;
    const data: ApplicantsByPeriod[] = await entityManager.query(applicantsCountSQL);
    const result: ApplicantsByPeriod[] = [];
    let i = 1;
    let temp = data.shift();
    while (i <= requestedPeriods) {
      if (temp?.period === i) {
        result.push(temp);
        temp = data.shift();
      } else {
        // If period data missing, Add it with 0 applicants
        result.push({
          period: i,
          applicants: 0,
          from: dayjs(from).add((i-1)*28, 'day').toISOString(),
          to: dayjs(from).add(((i-1)*28)+27, 'day').toISOString()
        });
      }
      i++;
    }
    this._updateLastPeriodToDate(result, to);
    return result;
  }

  _updateLastPeriodToDate(result: ApplicantsByPeriod[], to: string) {
    if (result.length) {
      const lastPeriodEndDate = result[result.length-1].to;
      if (dayjs(lastPeriodEndDate).isAfter(dayjs(to), 'day')) {
        result[result.length-1].to = dayjs(to).toISOString();
      }
    }
  }

  isValidDateValue(date: string) {
    if (date && !isValidDateFormat(date)) {
      throw new BadRequestException(
        `${date} is not a validate date, Please provide date in YYYY-MM-DD format.`,
      );
    }
  }
}
