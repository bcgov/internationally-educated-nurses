import { Inject, Logger } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { startDateOfFiscal, StatusCategory } from 'src/common/util';
import { ReportPeriodDTO } from '@ien/common';

const PERIOD_START_DATE = '2022-05-02';

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
  async getHiredWithdrawnActiveCount(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(
      `getHiredWithdrawnActiveCount: Apply date filter from (${from}) and to (${to})`,
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.hiredActiveWithdrawnApplicantCountQuery(from, to),
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
  async getLicensingStageApplicants(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getLicensingStageApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.licensingStageApplicantsQuery(from, to),
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
  async getLicenseApplicants(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getLicenseApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.licenseApplicantsQuery(from, to));
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
  async getRecruitmentApplicants(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getRecruitmentApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.applicantsInRecruitmentQuery(to));
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
  async getImmigrationApplicants(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getImmigrationApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.applicantsInImmigrationQuery(to));
    this.logger.log(
      `getImmigrationApplicants: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   */
  async getApplicantHAForCurrentPeriodFiscal(t: string) {
    const { to } = this.captureFromTo('', t);
    // Let's find current fiscal
    const from = startDateOfFiscal(to);
    this.logger.log(
      `getApplicantHAForCurrentPeriodFiscal: current period and Fiscal(start from ${from} till ${to} date)`,
    );

    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantHAForCurrentPeriodFiscalQuery(from, to),
    );
    this.logger.log(
      `getApplicantHAForCurrentPeriodFiscal: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  /**
   * @param t Duration end date YYYY-MM-DD
   */
  async getAverageTimeWithEachStakeholderGroup(t: string) {
    const { to } = this.captureFromTo('', t);
    this.logger.log(`getAverageTimeWithEachStakeholderGroup: apply filter till ${to} date)`);

    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.averageTimeWithEachStackholderGroupQuery(to),
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
      this.reportUtilService.extractApplicantsDataQuery(from, to, milestones)
    );
    this.logger.log(
      `extractApplicantsData: query completed a total of ${data.length} record returns`,
    );
    return data;
  }
}
