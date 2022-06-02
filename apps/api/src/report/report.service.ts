import { Inject, Logger } from '@nestjs/common';
import { getManager } from 'typeorm';
import dayjs from 'dayjs';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';

const PERIOD_START_DATE = '2021-04-01';

export class ReportService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ReportUtilService)
    private readonly reportUtilService: ReportUtilService,
  ) {}

  /**
   *
   * @param from Duration start date YYYY-MM-DD
   * @param to Duration end date YYYY-MM-DD
   * @returns
   */
  async getCountryWiseApplicantList(from: string, to: string) {
    this.reportUtilService._isValidDateValue(from);
    this.reportUtilService._isValidDateValue(to);
    if (!from) {
      from = PERIOD_START_DATE;
    }
    if (!to) {
      to = dayjs().format('YYYY-MM-DD');
    }
    this.logger.log(`Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.counrtyWiseApplicantQuery(from, to),
    );
    this.logger.log(`query completed a total of ${data.length - 1} record returns`);
    const defaultData = {
      us: 0,
      uk: 0,
      ireland: 0,
      australia: 0,
      philippines: 0,
      india: 0,
      nigeria: 0,
      jamaica: 0,
      kenya: 0,
      canada: 0,
      other: 0,
      'n/a': 0,
      total: 0,
    };
    const result = this.reportUtilService._addMissingPeriodWithDefaultData(
      defaultData,
      data,
      from,
      to,
    );
    // We have an additional row that holds the total count, so substracting it to get the final number of periods.
    this.logger.log(`After adding missing periods, a total of ${result.length - 1} record returns`);
    this.reportUtilService._updateLastPeriodToDate(result, to, 1);
    return result;
  }

  /**
   *
   * @param from Duration start date YYYY-MM-DD
   * @param to Duration end date YYYY-MM-DD
   * @returns
   */
  async getRegisteredApplicantList(from: string, to: string) {
    this.reportUtilService._isValidDateValue(from);
    this.reportUtilService._isValidDateValue(to);
    if (!from) {
      from = PERIOD_START_DATE;
    }
    if (!to) {
      to = dayjs().format('YYYY-MM-DD');
    }
    this.logger.log(`Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.applicantCountQuery(from, to));
    this.logger.log(`query completed a total of ${data.length} record returns`);
    const defaultData = {
      applicants: 0,
    };
    const result = this.reportUtilService._addMissingPeriodWithDefaultData(
      defaultData,
      data,
      from,
      to,
    );
    this.logger.log(`After adding missing periods, a total of ${result.length} record returns`);
    this.reportUtilService._updateLastPeriodToDate(result, to, 0);
    return result;
  }
}
