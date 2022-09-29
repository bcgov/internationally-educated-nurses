import { Inject, Logger } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { startDateOfFiscal } from 'src/common/util';
import { ReportPeriodDTO, StatusCategory } from '@ien/common';
import _ from 'lodash';

export const PERIOD_START_DATE = '2022-05-02';

export class ReportService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ReportUtilService)
    private readonly reportUtilService: ReportUtilService,
    @InjectRepository(IENApplicantStatus)
    private readonly ienapplicantStatusRepository: Repository<IENApplicantStatus>,
  ) {}

  captureFromTo(from: string, to: string) {
    this.reportUtilService._isValidDateValue(from);
    this.reportUtilService._isValidDateValue(to);
    if (!from) {
      from = PERIOD_START_DATE;
    }
    if (!to) {
      to = dayjs().format('YYYY-MM-DD');
    }
    return { from, to };
  }

  getStartOfLastPeriod(from: string, to: string): string {
    const daysOfLastPeriod = dayjs(to).diff(dayjs(from), 'day') % 28;
    return dayjs(to)
      .subtract(daysOfLastPeriod || 28, 'days')
      .format('YYYY-MM-DD');
  }

  async getStatusMap(): Promise<Record<string, string>> {
    const result = await this.ienapplicantStatusRepository.find({ select: ['id', 'status'] });
    return result.reduce((a, c) => _.assign(a, { [c.status]: c.id }), {});
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getCountryWiseApplicantList(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getCountryWiseApplicantList: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.counrtyWiseApplicantQuery(from, to),
    );
    this.logger.log(
      `getCountryWiseApplicantList: query completed a total of ${data.length - 1} record returns`,
    );
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
    this.logger.log(
      `getCountryWiseApplicantList: After adding missing periods, a total of ${
        result.length - 1
      } record returns`,
    );
    this.reportUtilService._updateLastPeriodToDate(result, to, 1);
    return result;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getRegisteredApplicantList(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getRegisteredApplicantList: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.applicantCountQuery(from, to));
    this.logger.log(
      `getRegisteredApplicantList: query completed a total of ${data.length} record returns`,
    );
    const defaultData = {
      applicants: 0,
    };
    const result = this.reportUtilService._addMissingPeriodWithDefaultData(
      defaultData,
      data,
      from,
      to,
    );
    this.logger.log(
      `getRegisteredApplicantList: After adding missing periods, a total of ${result.length} record returns`,
    );
    this.reportUtilService._updateLastPeriodToDate(result, to, 0);
    return result;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getHiredWithdrawnActiveApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(
      `getHiredWithdrawnActiveCount: Apply date filter from (${from}) and to (${to})`,
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.hiredActiveWithdrawnApplicantCountQuery(statuses, from, to),
    );
    this.logger.log(
      `getHiredWithdrawnActiveCount: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getLicensingStageApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getLicensingStageApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.licensingStageApplicantsQuery(statuses, from, to),
    );
    this.logger.log(
      `getLicensingStageApplicants: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getLicenseApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getLicenseApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.licenseApplicantsQuery(statuses, from, to),
    );
    this.logger.log(
      `getLicenseApplicants: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getRecruitmentApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getRecruitmentApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantsInRecruitmentQuery(statuses, to),
    );
    this.logger.log(
      `getRecruitmentApplicants: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   *
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getImmigrationApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getImmigrationApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantsInImmigrationQuery(statuses, to),
    );
    this.logger.log(
      `getImmigrationApplicants: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   */
  async getApplicantHAForCurrentPeriodFiscal(
    statuses: Record<string, string>,
    from: string,
    to: string,
  ) {
    const range = this.captureFromTo(from, to);
    // Let's find current fiscal
    const currentPeriodStart = this.getStartOfLastPeriod(from, to);
    const fiscalStart = startDateOfFiscal(range.to);
    this.logger.log(
      `getApplicantHAForCurrentPeriodFiscal: current period and Fiscal(start from ${from} till ${to} date)`,
    );

    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantHAForCurrentPeriodFiscalQuery(
        statuses,
        currentPeriodStart,
        fiscalStart,
        range.to,
      ),
    );
    this.logger.log(
      `getApplicantHAForCurrentPeriodFiscal: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   * @param t Duration end date YYYY-MM-DD
   */
  async getAverageTimeWithEachStakeholderGroup(statuses: Record<string, string>, t: string) {
    const { to } = this.captureFromTo('', t);
    this.logger.log(`getAverageTimeWithEachStakeholderGroup: apply filter till ${to} date)`);

    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.averageTimeWithEachStakeholderGroupQuery(statuses, to),
    );
    this.logger.log(
      `getAverageTimeWithEachStakeholderGroup: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   *
   * @param dates start and end date for data extract YYYY-MM-DD
   * @returns
   */

  async extractApplicantsData(dates: ReportPeriodDTO) {
    const { from, to } = dates;
    this.logger.log(`extractApplicantsData: Apply date filter from (${from}) and to (${to})`);

    const milestones: IENApplicantStatus[] = await this.ienapplicantStatusRepository.find({
      where: { category: StatusCategory.RECRUITMENT },
    });
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.extractApplicantsDataQuery(from, to, milestones),
    );
    this.logger.log(
      `extractApplicantsData: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  async getReport(from: string, to: string): Promise<object> {
    const statuses = await this.getStatusMap();
    const promises: Promise<object>[] = [
      this.getRegisteredApplicantList(from, to).then(report1 => ({ report1 })),
      this.getCountryWiseApplicantList(from, to).then(report2 => ({ report2 })),
      this.getHiredWithdrawnActiveApplicants(statuses, from, to).then(report3 => ({ report3 })),
      this.getLicensingStageApplicants(statuses, from, to).then(report4 => ({ report4 })),
      this.getLicenseApplicants(statuses, from, to).then(report5 => ({ report5 })),
      this.getRecruitmentApplicants(statuses, from, to).then(report6 => ({ report6 })),
      this.getImmigrationApplicants(statuses, from, to).then(report7 => ({ report7 })),
      this.getApplicantHAForCurrentPeriodFiscal(statuses, from, to).then(report8 => ({ report8 })),
      this.getAverageTimeWithEachStakeholderGroup(statuses, to).then(report9 => ({ report9 })),
    ];
    const report = await Promise.all(promises);
    return report.reduce((a, c) => _.assign(a, c), {});
  }
}
