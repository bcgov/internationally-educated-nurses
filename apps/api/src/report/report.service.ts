import { BadRequestException } from '@nestjs/common';
import { getStartEndDateOfWeek, isValidDateFormat } from 'src/common/util';
import { getManager } from 'typeorm';
const WEEKS_PER_PERIOD = 4;

export class ReportService {
  async getCountryWiseApplicantList() {
    const entityManager = getManager();
    return await entityManager.query(`
        SELECT count(id) as applicants, t2.country FROM
        (
            SELECT * FROM (
            SELECT id, TRIM(BOTH '"'
                            FROM (json_array_elements(nursing_educations::json)->'country')::TEXT) as country
            FROM public.ien_applicants
            ) AS t1 GROUP BY t1.id, t1.country
        ) AS t2
        WHERE t2.country IS NOT NULL
        GROUP BY t2.country
        ORDER BY applicants desc;
    `);
  }

  async getRegisteredApplicantList(from: string, to: string) {
    if (from && !isValidDateFormat(from)) {
      throw new BadRequestException(`Please provide from date in YYYY-MM-DD format`);
    }
    if (to && !isValidDateFormat(to)) {
      throw new BadRequestException(`Please provide to date in YYYY-MM-DD format`);
    }
    /**design where clause */
    const query = this.buildQuery(from, to);

    const entityManager = getManager();
    const result = await entityManager.query(`
        SELECT 	
            date_part('week', created_date::date) AS weekly,
            date_part('year', created_date::date) AS yearly,
            COUNT(*)::integer as applicants          
        FROM public.ien_applicants
        ${query}
        GROUP BY yearly, weekly
        ORDER BY yearly, weekly;
    `);
    if (result.length) {
      const data = this.prepareWeeklyApplicantsCount(result);
      if (data.length > 0) {
        /** We have apply filter based on from-to date
         * and query return a week number
         * So we need to adjust first and last records' period start and end date.
         * for example,
         * we enter from date 2022-01-06 (Wednesday, 2nd week of 2022)
         * then record fetch from 2022-01-06 in the query,
         * but 2nd week of 2022's start date is 2022-01-02.
         * SHere we are going to adjust it in return result.
         */
        if (new Date(from) > new Date(data[0].from)) {
          data[0].from = new Date(from).toISOString().slice(0, 10);
        }
        if (new Date(to) < new Date(data[data.length - 1].to)) {
          data[data.length - 1].to = new Date(to).toISOString().slice(0, 10);
        }
      }
      return data;
    }
    return [];
  }

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

  prepareWeeklyApplicantsCount(result: any) {
    let i = 0;
    const count = result.length;
    const periodData = [];
    let periodCount = 0;
    while (i < count) {
      let weekData = result[i];
      const { startdate, enddate } = getStartEndDateOfWeek(
        weekData.weekly,
        weekData.yearly,
        WEEKS_PER_PERIOD,
      );
      const period = {
        period: `Period ${++periodCount}`,
        from: startdate.toISOString().slice(0, 10),
        to: enddate.toISOString().slice(0, 10),
        year: weekData.yearly,
        week: weekData.weekly,
        applicants: weekData.applicants,
      };
      let tempYear = weekData.yearly;
      let tempWeek = weekData.weekly;
      let remainWeeks = WEEKS_PER_PERIOD;
      // We have decided to group data into 4 weeks
      // We can create function in database which is less readable
      // So here we will fetch next 3 upcoming weeks' data and
      // Update the existing period with the same.
      while (remainWeeks > 0) {
        weekData = result[++i];
        tempWeek += 1;
        if (tempWeek > 53) {
          tempWeek = 1; //need to reset it to 1 for a new year.
          tempYear += 1;
        }
        if (tempWeek === weekData?.weekly && tempYear === weekData?.yearly) {
          period.applicants += weekData.applicants;
        }
        remainWeeks--;
      }
      periodData.push(period);
    }
    return periodData;
  }
}
