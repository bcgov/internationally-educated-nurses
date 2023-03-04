import { Inject, Logger } from '@nestjs/common';
import { mean, median, min, mode, round } from 'mathjs';
import { getManager, Repository, In, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';
import { IENHaPcn } from '../applicant/entity/ienhapcn.entity';
import { MILESTONE_DURATION_ENTRIES } from './constants';
import { MilestoneDurationEntity } from './entity/milestone-duration.entity';
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
    return _.chain(result).keyBy('status').mapValues('id').value();
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
   * Get average time spent on the stages, NNAS, BCCNM & NCAS, Recruitment by Health Authorities, and Immigration
   * including overall time from the start to immigration completion and average time to hire.
   *
   * NOTE: Counting only hired applicants completed immigration
   *
   * @param t end date of report, YYYY-MM-DD
   */
  async getAverageTimeWithEachStakeholderGroup(statuses: Record<string, string>, t: string) {
    const { to } = this.captureFromTo('', t);
    this.logger.log(`getAverageTimeWithEachStakeholderGroup: apply filter till ${to} date)`);

    // to get durations of NNAS, BCCNM & NCAS, Immigration, Overall, and Average time to hire
    const durations = await getRepository(MilestoneDurationEntity)
      .createQueryBuilder()
      .where(`hired_at <= :to AND immigrated_at  <= :to`, { to })
      .getMany();

    // excludes applicants with a negative duration caused by nonlinear milestones
    const linearDurations = durations.filter(d => !Object.values(d).some(v => v < 0));

    // to get duration of recruitment by Health Authorities
    const durationByHAs = await getManager()
      .createQueryBuilder(IENHaPcn, 'ha')
      .select('ha.title', 'HA')
      .addSelect(`CAST(COALESCE(ROUND(AVG(md.recruitment), 2), 0) AS FLOAT)`, 'Mean')
      .addSelect(`COALESCE(MODE() WITHIN GROUP (ORDER BY md.recruitment), 0)`, 'Mode')
      .addSelect(
        `COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY md.recruitment), 0)`,
        'Median',
      )
      .leftJoin(
        qb => {
          return qb
            .from(MilestoneDurationEntity, 'd')
            .where(`d.hired_at <= :to AND d.immigrated_at <= :to`, { to })
            .andWhere(`LEAST(d.pre_screen, interview, reference_check, hired) > 0`);
        },
        'md',
        'ha.title = md.ha',
      )
      .groupBy('ha.id')
      .getRawMany();

    const data = [
      { title: 'NNAS', HA: ' ', ...this.getDurationStats(linearDurations.map(d => d.nnas)) },
      {
        title: 'BCCNM & NCAS',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.bccnm_ncas)),
      },
      ...durationByHAs.map(ha => ({ title: ' ', ...ha })),
      {
        title: 'Immigration',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.immigration)),
      },
      {
        title: 'Overall',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.overall)),
      },
      {
        title: 'Average time to hire',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.to_hire)),
      },
    ];
    return data;
  }

  private getDurationStats(durations: number[]) {
    const data = durations.filter(v => v !== null && v >= 0);
    return {
      Mean: data.length ? round(mean(data), 2) : '',
      Mode: data.length ? min(mode(data)) : '',
      Median: data.length ? median(data) : '',
    };
  }

  /**
   * Report 10
   * Get average time spent on each stage and milestone
   *
   * NOTE: Counting only hired applicants completed immigration
   *
   * @param t end date of report, YYYY-MM-DD
   */
  async getAverageTimeOfMilestones(t: string) {
    const { to } = this.captureFromTo('', t);
    this.logger.log(`getAverageTimeOfMilestones: apply filter till ${to} date)`);

    const durations = await getRepository(MilestoneDurationEntity)
      .createQueryBuilder()
      .where(`hired_at <= :to AND immigrated_at  <= :to`, { to })
      .getMany();

    // excludes applicants with a negative duration caused by nonlinear milestones
    const linearDurations = durations.filter(d => !Object.values(d).some(v => v < 0));

    // if stage or milestone is empty string, it would be formatted as 0 in the spreadsheet.
    return MILESTONE_DURATION_ENTRIES.map(({ stage = ' ', milestone = ' ', field }) => {
      return {
        stage,
        milestone,
        ...this.getDurationStats(linearDurations.map((entry: any) => entry[field])),
      };
    });
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
      this.getAverageTimeOfMilestones(to).then(report10 => ({ report10 })),
    ];
    const report = await Promise.all(promises);
    return report.reduce((a, c) => _.assign(a, c), {});
  }
}
