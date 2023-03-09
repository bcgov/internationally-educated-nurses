import { Inject, Logger } from '@nestjs/common';
import { mean, median, min, mode, round } from 'mathjs';
import { getManager, Repository, In, getRepository, getConnection, Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';

import { IENHaPcn } from '../applicant/entity/ienhapcn.entity';
import { DURATION_STAGES, REPORT_FOUR_STEPS } from './constants';
import { MilestoneDurationEntity } from './entity/milestone-duration.entity';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { startDateOfFiscal } from 'src/common/util';
import { ReportCacheEntity } from './entity/report-cache.entity';
import { ReportPeriodDTO, STATUS, StatusCategory ,LIC_REG_STAGE} from '@ien/common';

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
   * @param period report period to select
   * @returns
   */
  async getLicensingStageApplicants(period: number) {
    const report_number = 4;
    const report = await getRepository(ReportCacheEntity)
      .createQueryBuilder('rce')
      .where('rce.report_period = :period', { period })
      .andWhere('rce.report_number = :report_number', { report_number })
      .orderBy('rce.created_date', 'DESC')
      .getOne();

    // if no cache report is found, find the { to } date for period requested
    // and generate a current data report
    if (!report) {
      const periods = await this.getRegisteredApplicantList('', '');
      const { to } = periods.find(p => p.period === period);

      return this.splitReportFourNewOldProcess('', to);
    }

    const data = JSON.parse(report?.report_data);

    return data;
  }

  /**
   * Cache Report 4
   * function for cachereportfour lambda handler
   * saves report data to report_cache table
   */
  async updateReportCache(pe?: { from: string; to: string }[]) {
    const periods = pe ?? (await this.getRegisteredApplicantList('', ''));
    this.logger.log(`periods were received`);
    await Promise.all(
      periods.map(async p => {
        this.logger.log(`attempting to map period ${p.period}: ${p.to}`);
        // split applicants into new and old process fields
        const data = await this.splitReportFourNewOldProcess('', p.to);
        this.logger.log(`data split for new and old was successful`);
        // find existing report if it exists
        const reportRow = await getRepository(ReportCacheEntity).findOne({
          select: ['id'],
          where: {
            report_number: 4,
            report_period: p.period,
          },
        });
        this.logger.log(`attempt to find report row was successful`);
        const cacheData: Partial<ReportCacheEntity> = {
          id: reportRow?.id,
          report_number: 4,
          report_period: p.period,
          report_data: JSON.stringify(data),
          updated_date: new Date(),
        };
        this.logger.log(`created cache entity from data`);
        await getRepository(ReportCacheEntity).upsert(cacheData, ['id']);
        this.logger.log(`upserted data into db`);
      }),
    );
  }

  /**
   * Splits process into new and old for report 4
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async splitReportFourNewOldProcess(f: string, t: string) {
    const statuses = await this.getStatusMap();
    const { from, to } = this.captureFromTo(f, t);

    this.logger.log(`getLicensingStageApplicants: Apply date filter from (${from}) and to (${to})`);
    const connection = getConnection();
    const mappedStatuses = LIC_REG_STAGE.map(licensingStatus => {
      return statuses[licensingStatus];
    });
    const mappedStatusesString = mappedStatuses.map(status => `'${status}'`).join(',');
    try {
      const oldProcess = await connection.query(
        this.reportUtilService.reportFour(mappedStatusesString, from, to, false),
      );
      const newProcess = await connection.query(
        this.reportUtilService.reportFour(mappedStatusesString, from, to, true),
      );
      const licenseResults = await this.countLicense(connection);
      return this.mapReportFourResults(statuses, oldProcess, newProcess, licenseResults);
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }
  mapReportFourResults(
    statuses: Record<string, string>,
    oldProcess: { status_id: string; count: string }[],
    newProcess: { status_id: string; count: string }[],
    licenceResults: any,
  ) {
    let report = REPORT_FOUR_STEPS.map((step: string) => {
      switch (step) {
        case 'Granted full licensure':
          return {
            status: step,
            oldProcessApplicants: licenceResults.oldFullLicence[0]?.count || '0',
            newProcessApplicants: licenceResults.newFullLicence[0]?.count || '0',
          };

        case 'Granted provisional licensure':
          return {
            status: step,
            oldProcessApplicants: licenceResults.oldProvisionalLicence[0]?.count || '0',
            newProcessApplicants: licenceResults.newProvisionalLicence[0]?.count || '0',
          };
        case 'Applied to NNAS':
          return {
            status: step,
            oldProcessApplicants: this.findAndSumStatusCounts(oldProcess, [
              statuses[STATUS.APPLIED_TO_NNAS],
              statuses[STATUS.SUBMITTED_DOCUMENTS],
              statuses[STATUS.RECEIVED_NNAS_REPORT],
            ]),
            newProcessApplicants: this.findAndSumStatusCounts(newProcess, [
              statuses[STATUS.APPLIED_TO_NNAS],
              statuses[STATUS.SUBMITTED_DOCUMENTS],
              statuses[STATUS.RECEIVED_NNAS_REPORT],
            ]),
          };

        case 'Completed Additional Education':
          return {
            status: step,
            oldProcessApplicants: this.findAndSumStatusCounts(oldProcess, [
              statuses[STATUS.REFERRED_TO_ADDITIONAL_EDUCTION],
              statuses[STATUS.COMPLETED_ADDITIONAL_EDUCATION],
            ]),
            newProcessApplicants: this.findAndSumStatusCounts(newProcess, [
              statuses[STATUS.REFERRED_TO_ADDITIONAL_EDUCTION],
              statuses[STATUS.COMPLETED_ADDITIONAL_EDUCATION],
            ]),
          };

        case 'Referred to NCAS':
          return {
            status: step,
            oldProcessApplicants: this.findAndSumStatusCounts(oldProcess, [
              statuses[STATUS.REFERRED_TO_NCAS],
              statuses[STATUS.COMPLETED_CBA],
              statuses[STATUS.COMPLETED_SLA],
            ]),
            newProcessApplicants: this.findAndSumStatusCounts(newProcess, [
              statuses[STATUS.REFERRED_TO_NCAS],
              statuses[STATUS.COMPLETED_CBA],
              statuses[STATUS.COMPLETED_SLA],
            ]),
          };
        default:
          return {
            status: step,
            oldProcessApplicants:
              oldProcess.find(value => value.status_id === statuses[step])?.count || '0',
            newProcessApplicants:
              newProcess.find(value => value.status_id === statuses[step])?.count || '0',
          };
      }
    });
    return report;
  }
  findAndSumStatusCounts(list: { status_id: string; count: string }[], acceptedIds: string[]) {
    let count = 0;
    acceptedIds.forEach(id => {
      count += parseInt(
        list.find((row: { status_id: string; count: string }) => row.status_id === id)?.count ||
          '0',
      );
    });
    return count.toString();
  }

  /**
   * Report 4 count licenses
   */
  async countLicense(connection: Connection) {
    return {
      oldFullLicence: await connection.query(this.reportUtilService.fullLicenceQuery(false)),
      oldProvisionalLicence: await connection.query(
        this.reportUtilService.partialLicenceQuery(false),
      ),
      newFullLicence: await connection.query(this.reportUtilService.fullLicenceQuery(true)),
      newProvisionalLicence: await connection.query(
        this.reportUtilService.partialLicenceQuery(true),
      ),
    };
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
      {
        title: 'NNAS',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.nnas).filter(v => v !== null)),
      },
      {
        title: 'BCCNM & NCAS',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.bccnm_ncas).filter(v => v !== null)),
      },
      ...durationByHAs.map(ha => ({ title: ' ', ...ha })),
      {
        title: 'Immigration',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.immigration).filter(v => v !== null)),
      },
      {
        title: 'Overall',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.overall).filter(v => v !== null)),
      },
      {
        title: 'Average time to hire',
        HA: ' ',
        ...this.getDurationStats(linearDurations.map(d => d.to_hire).filter(v => v !== null)),
      },
    ];
    this.logger.log(
      `getAverageTimeWithEachStakeholderGroup: query completed a total of ${data.length} record returns`,
    );
    return data;
  }

  private getDurationStats(durations: number[]) {
    // do not change the number of items by filtering.
    // it'll cause stage duration not to match the sum of its milestones.
    const data = durations.map(v => v || 0);
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

    const data = _.flatten(
      DURATION_STAGES.map(stageFields => {
        const stageMilestone = stageFields[0];
        // take entries with the stage duration is not null so that the same number of samples could be used to
        // calculate the mean value for the stage and its milestones
        const validDurations = linearDurations.filter(
          (entry: any) => entry[stageMilestone.field] !== null,
        );
        // if stage or milestone is empty string, it would be formatted as 0 in the spreadsheet.
        return stageFields.map(({ stage = ' ', milestone = ' ', field }) => {
          return {
            stage,
            milestone,
            ...this.getDurationStats(validDurations.map((entry: any) => entry[field])),
          };
        });
      }),
    );

    this.logger.log(
      `getAverageTimeOfMilestones: query completed a total of ${data.length} record returns`,
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

  async getReport(from: string, to: string, period: number): Promise<object> {
    const statuses = await this.getStatusMap();
    const promises: Promise<object>[] = [
      this.getRegisteredApplicantList(from, to).then(report1 => ({ report1 })),
      this.getCountryWiseApplicantList(from, to).then(report2 => ({ report2 })),
      this.getHiredWithdrawnActiveApplicants(statuses, from, to).then(report3 => ({ report3 })),
      this.getLicensingStageApplicants(period).then(report4 => ({ report4 })),
      this.getLicenseApplicants(statuses, from, to).then(report5 => ({ report5 })),
      this.getRecruitmentApplicants(statuses, from, to).then(report6 => ({ report6 })),
      this.getImmigrationApplicants(statuses, from, to).then(report7 => ({ report7 })),
      this.getApplicantHAForCurrentPeriodFiscal(statuses, from, to).then(report8 => ({ report8 })),
      this.getAverageTimeWithEachStakeholderGroup(statuses, to).then(report9 => ({ report9 })),
      this.getAverageTimeOfMilestones(to).then(report10 => ({ report10 })),
    ];
    const report = await Promise.all(
      promises.map(async (p, index) => {
        const start = Date.now();
        const data = await p;
        this.logger.log(`Report ${index + 1} took ${(Date.now() - start) / 1000} seconds`);
        return data;
      }),
    );
    return report.reduce((a, c) => _.assign(a, c), {});
  }
}
