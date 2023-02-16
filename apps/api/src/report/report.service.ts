import { Inject, Logger } from '@nestjs/common';
import { floor, mean, median, mode } from 'mathjs';
import { getManager, Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';
import { IMMIGRATION_DURATIONS, LICENSE_RECRUITMENT_DURATIONS } from './constants';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { startDateOfFiscal } from 'src/common/util';
import { ReportPeriodDTO, StatusCategory } from '@ien/common';

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
   * Report 2
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getCountryWiseApplicantList(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getCountryWiseApplicantList: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.countryWiseApplicantQuery(from, to),
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
   * Report 1
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
   * Report 3
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
   * Report 4
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getLicensingStageApplicants(statuses: Record<string, string>, f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(`getLicensingStageApplicants: Apply date filter from (${from}) and to (${to})`);
    const entityManager = getManager();
    const oldProcess = await entityManager.query(
      this.reportUtilService.licensingStageApplicantsQuery(statuses, from, to),
    );

    const newProcess = await entityManager.query(
      this.reportUtilService.licensingStageApplicantsQuery(statuses, from, to, true),
    );

    // combine old data with new data
    const data = oldProcess.map((o: { status: string; applicants: string }) => {
      const newProcessApplicants = newProcess.find(
        (n: { status: string }) => n.status === o.status,
      );
      return {
        status: o.status,
        oldProcessApplicants: o.applicants,
        newProcessApplicants: newProcessApplicants.applicants,
      };
    });

    this.logger.log(
      `getLicensingStageApplicants: query completed a total of ${oldProcess.length} old process and ${newProcess.length} new process record returns`,
    );
    return data;
  }

  /**
   * Report 5
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
   * Report 6
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
   * Report 7
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
   * Report 8
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
   * Report 9
   * @param t end date of report, YYYY-MM-DD
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

  private getMilestoneDurationStats(milestone: string, entries: any[]) {
    const data = entries.map((e: any) => e[milestone]).filter(v => v !== null && v >= 0);
    return {
      Mean: data.length ? floor(mean(data), 2) : '',
      Mode: data.length ? mode(data)[0] : '',
      Median: data.length ? median(data) : '',
    };
  }

  /**
   * Report 10
   * @param t end date of report, YYYY-MM-DD
   */
  async getAverageTimeOfMilestones(statuses: Record<string, string>, t: string) {
    const { to } = this.captureFromTo('', t);
    this.logger.log(`getAverageTimeOfMilestones: apply filter till ${to} date)`);

    const licRecDurations = await getManager().query(`
      SELECT * FROM milestone_duration
      WHERE hired_date <= '${to}' OR withdraw_date <= '${to}'
    `);

    // the end date of immigration milestones should be limited by 'to' date instead of hired date
    // because immigration stage comes after recruitment
    const immigrationDurations = await getManager().query(`
      SELECT id, 
        (CASE WHEN immigration IS NOT null THEN
          (LEAST(withdraw_date, immigration_completed, '${to}') - immigration)
        END) AS immigration,
        (CASE WHEN sent_first_steps_document IS NOT null THEN
          (LEAST(withdraw_date, sent_employer_documents_to_hmbc, submitted_bc_pnp_application, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, '${to}') - sent_first_steps_document)
        END) AS sent_first_steps_document,
        (CASE WHEN sent_employer_documents_to_hmbc IS NOT null THEN
          (LEAST(withdraw_date, submitted_bc_pnp_application, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, '${to}') - sent_employer_documents_to_hmbc)
        END) AS sent_employer_documents_to_hmbc,
        (CASE WHEN submitted_bc_pnp_application IS NOT null THEN
          (LEAST(withdraw_date, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, '${to}') - submitted_bc_pnp_application)
        END) AS submitted_bc_pnp_application,
        (CASE WHEN received_confirmation_of_nomination IS NOT null THEN
          (LEAST(withdraw_date, sent_second_steps_document, submitted_work_permit_application, immigration_completed, '${to}') - received_confirmation_of_nomination)
        END) AS received_confirmation_of_nomination,
        (CASE WHEN sent_second_steps_document IS NOT null THEN
          (LEAST(withdraw_date, submitted_work_permit_application, immigration_completed, '${to}') - sent_second_steps_document)
        END) AS sent_second_steps_document,
        (CASE WHEN submitted_work_permit_application IS NOT null THEN
          (LEAST(withdraw_date, immigration_completed, '${to}') - submitted_work_permit_application)
        END) AS submitted_work_permit_application,
        (CASE WHEN received_work_permit_approval_letter IS NOT null THEN
          (LEAST(withdraw_date, received_work_permit, received_pr, '${to}') - received_work_permit_approval_letter)
        END) AS received_work_permit_approval_letter,
        (CASE WHEN received_work_permit IS NOT null THEN
          (LEAST(withdraw_date, received_pr, '${to}') - received_work_permit)
        END) AS received_work_permit
      FROM hired_withdrawn_applicant_milestone
    `);

    // if stage or milestone is empty string, it would be formatted as 0 in the spreadsheet.
    return [
      ...LICENSE_RECRUITMENT_DURATIONS.map(({ stage = ' ', milestone = ' ', field }) => {
        return { stage, milestone, ...this.getMilestoneDurationStats(field, licRecDurations) };
      }),
      ...IMMIGRATION_DURATIONS.map(({ stage = ' ', milestone = ' ', field }) => {
        return { stage, milestone, ...this.getMilestoneDurationStats(field, immigrationDurations) };
      }),
    ];
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
      where: {
        category: In([
          StatusCategory.RECRUITMENT,
          StatusCategory.LICENSING_REGISTRATION,
          StatusCategory.BC_PNP,
        ]),
      },
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
      this.getAverageTimeOfMilestones(statuses, to).then(report10 => ({ report10 })),
    ];
    const report = await Promise.all(promises);
    return report.reduce((a, c) => _.assign(a, c), {});
  }
}
