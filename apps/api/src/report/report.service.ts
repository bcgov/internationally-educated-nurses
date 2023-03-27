import { Inject, Logger } from '@nestjs/common';
import { mean, median, min, mode, round } from 'mathjs';
import { getManager, Repository, In, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import _ from 'lodash';

import { DURATION_STAGES, REPORT_FOUR_STEPS } from './constants';
import { ReportUtilService } from './report.util.service';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantStatus } from 'src/applicant/entity/ienapplicant-status.entity';
import { startDateOfFiscal } from 'src/common/util';
import { ReportCacheEntity } from './entity/report-cache.entity';
import { Authorities, ReportPeriodDTO, STATUS, StatusCategory } from '@ien/common';
import { DurationEntry, DurationSummary, MilestoneTableEntry } from './types';

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
   * Report 1
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getRegisteredApplicantList(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(
      `Report 1: Number of applicants: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );
    const entityManager = getManager();
    const data = await entityManager.query(this.reportUtilService.applicantCountQuery(from, to));
    this.logger.log(
      `Report 1 - Number of applicants: query completed a total of ${data.length} record returns`,
      'REPORT',
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
      `Report 1 - Number of applicants: After adding missing periods, a total of ${result.length} record returns`,
      'REPORT',
    );
    this.reportUtilService._updateLastPeriodToDate(result, to, 0);
    return result;
  }

  /**
   * Report 2
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getCountryWiseApplicantList(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(
      `Report 2 - Applicants by education country: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.countryWiseApplicantQuery(from, to),
    );
    this.logger.log(
      `Report 2 - Applicants by education country: query completed a total of ${
        data.length - 1
      } record returns`,
      'REPORT',
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
      `Report 2 - Applicants by education country:: After adding missing periods, a total of ${
        result.length - 1
      } record returns`,
      'REPORT',
    );
    this.reportUtilService._updateLastPeriodToDate(result, to, 1);
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
      `Report 3 - Active/Hired/Withdrawn: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.hiredActiveWithdrawnApplicantCountQuery(statuses, from, to),
    );
    this.logger.log(
      `Report 3 - Active/Hired/Withdrawn: query completed a total of ${data.length} record returns`,
      'REPORT',
    );
    return data;
  }

  /**
   * Report 4
   * @param period report period to select
   * @returns
   */
  async getLicensingStageApplicants(period: number) {
    this.logger.log(
      `Report 4: Applicants in licensing stage: try cache for period ${period}`,
      'REPORT',
    );

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
    this.logger.log(
      `Report 4: Applicants in licensing stage: returns cache for period ${period}`,
      'REPORT',
    );
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

    this.logger.log(
      `Report 4: Applicants in licensing stage: apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );

    const manager = getManager();
    try {
      const oldProcess = await manager.query(this.reportUtilService.reportFour(from, to, false));
      const newProcess = await manager.query(this.reportUtilService.reportFour(from, to, true));
      const licenseResults = await this.countLicense(statuses);
      const withdrawnOld = (
        await manager.query(this.reportUtilService.getWithdrawn(to, from, false))
      )[0].count;
      const withdrawnNew = (
        await manager.query(this.reportUtilService.getWithdrawn(to, from, true))
      )[0].count;
      const data = this.mapReportFourResults(
        statuses,
        oldProcess,
        newProcess,
        licenseResults,
        withdrawnOld,
        withdrawnNew,
      );

      this.logger.log(
        `Report 4 - Applicants in licensing stage: a total of ${oldProcess.length} old process and ${newProcess.length} new process record returns`,
        'REPORT',
      );
      return data;
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
    withdrawnOld: string,
    withdrawnNew: string,
  ) {
    return REPORT_FOUR_STEPS.map((step: STATUS | string) => {
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
        case STATUS.APPLIED_TO_NNAS:
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

        case STATUS.COMPLETED_ADDITIONAL_EDUCATION:
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

        case STATUS.REFERRED_TO_NCAS:
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
        case STATUS.WITHDREW_FROM_PROGRAM:
          return {
            status: step,
            oldProcessApplicants: withdrawnOld,
            newProcessApplicants: withdrawnNew,
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
  }
  findAndSumStatusCounts(list: { status_id: string; count: string }[], acceptedIds: string[]) {
    let count = 0;
    acceptedIds.forEach(
      id =>
        (count += +(
          list.find((row: { status_id: string; count: string }) => row.status_id === id)?.count ||
          '0'
        )),
    );
    return count.toString();
  }

  /**
   * Report 4 count licenses
   */
  async countLicense(statuses: Record<string, string>) {
    return {
      oldFullLicence: await getManager().query(
        this.reportUtilService.fullLicenceQuery(false, statuses),
      ),
      oldProvisionalLicence: await getManager().query(
        this.reportUtilService.partialLicenceQuery(false, statuses),
      ),
      newFullLicence: await getManager().query(
        this.reportUtilService.fullLicenceQuery(true, statuses),
      ),
      newProvisionalLicence: await getManager().query(
        this.reportUtilService.partialLicenceQuery(true, statuses),
      ),
    };
  }

  /**
   * Report 5
   * @param f Duration start date YYYY-MM-DD
   * @param t Duration end date YYYY-MM-DD
   * @returns
   */
  async getLicenseApplicants(f: string, t: string) {
    const { from, to } = this.captureFromTo(f, t);
    this.logger.log(
      `Report 5: Number of applicants with license: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );

    let data = await this.reportUtilService.getNumberOfApplicantsByLicense(from, to);
    data = Object.entries(data[0]).map(([status, applicant_count]) => ({
      status,
      applicant_count,
    }));

    this.logger.log(
      `Report 5 - Number of applicants with license: query completed a total of ${data.length} record returns`,
      'REPORT',
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
    this.logger.log(
      `Report 6: Applicants by HA in recruitment stage: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantsInRecruitmentQuery(statuses, to),
    );
    this.logger.log(
      `Report 6 - Applicants by HA in recruitment stage: query completed a total of ${data.length} record returns`,
      'REPORT',
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
    this.logger.log(
      `Report 7: Applicant by HA in immigration stage: Apply date filter from (${from}) and to (${to})`,
      'REPORT',
    );
    const entityManager = getManager();
    const data = await entityManager.query(
      this.reportUtilService.applicantsInImmigrationQuery(statuses, to),
    );
    this.logger.log(
      `Report 7 - Applicant by HA in immigration stage: query completed a total of ${data.length} record returns`,
      'REPORT',
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
      `Report 8 - Applicants by HA For Current Period/Fiscal: current period and Fiscal(start from ${from} till ${to} date)`,
      'REPORT',
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
      `Report 8 - Applicants by HA For Current Period/Fiscal: query completed a total of ${data.length} record returns`,
      'REPORT',
    );
    return data;
  }

  /**
   * Get mean, median, mode values of applicants for each stage and milestone
   *
   * @param stage
   * @param durations
   * @param verbose
   */
  getStageDurationStats(stage: DurationEntry[], durations: DurationSummary[], verbose = false) {
    const stageName = stage[0].stage as keyof DurationSummary;

    const applicants = durations.filter(d => d[stageName]);

    const employerDurations: Record<string, number[]> = {};

    if (stageName === 'Recruitment') {
      // get each HA's list of recruitment time
      durations.forEach(d => {
        if (d.ha && d.Recruitment) {
          if (!employerDurations[d.ha]) employerDurations[d.ha] = [];
          employerDurations[d.ha].push(d.Recruitment);
        }
      });

      return Object.values(Authorities)
        .filter(ha => ![Authorities.MOH, Authorities.HMBC].includes(ha))
        .map(ha => ha.name)
        .sort()
        .map(ha => {
          const values = employerDurations[ha] || [];
          const row = {
            title: ' ',
            HA: ha,
            ...this.getDurationStats(values),
          };
          if (verbose) Object.assign(row, { count: values.length, values });
          return row;
        });
    }

    // report 9 needs stage stats only
    const values = applicants.map(d => (d[stageName] as number) || 0);
    const row = {
      title: stageName,
      HA: ' ',
      ...this.getDurationStats(values),
    };
    if (verbose) Object.assign(row, { count: values.length, values });
    return row;
  }

  /**
   * Report 9
   * Get average time spent on the stages, NNAS, BCCNM & NCAS, Recruitment by Health Authorities, and Immigration
   * including overall time from the start to immigration completion and average time to hire.
   *
   * - Each stage counts applicants who completed the stage.
   *
   * NNAS
   * BCCNM & NCAS
   * Employer
   *    First Nations Health Authority
   *    Fraser Health Authority
   *    Interior Health Authority
   *    Northern Health Authority
   *    Providence Health Care Society
   *    Provincial Health Services Authority
   *    Vancouver Coastal Health Authority
   *    Vancouver Island Health Authority
   * Immigration
   * Overall
   * Average time to hire
   *
   * @param end date of report, YYYY-MM-DD
   * @param verbose if true, include the list of values used to calculate mean, mode, and median.
   */
  async getReport9(end: string, verbose = false): Promise<object[]> {
    const { to } = this.captureFromTo('', end);
    this.logger.log(
      `Report 9 - Average time with each health authority: apply filter till ${to} date)`,
      'REPORT',
    );
    const table = await this.reportUtilService.getMilestoneTable(to);

    // set health authorities who hired applicants
    const idHaMap = await this.reportUtilService.getHiredApplicantHAs();
    for (const [id, ha] of Object.entries(idHaMap)) {
      if (table[id]) table[id].ha = ha;
    }

    // calculate durations and summaries
    const durations = Object.values(table)
      .map(this.reportUtilService.getDurationTableEntry)
      .map(this.reportUtilService.getDurationSummary);

    // generate final report form
    const data = _.flatten(
      DURATION_STAGES.map(stage => {
        return this.getStageDurationStats(stage, durations, verbose);
      }),
    ).filter(v => !!v);

    // COUNT ONLY APPLICANTS COMPLETED ALL STAGES
    const overallDurations = durations
      .filter(d => d.Immigration && d.Recruitment)
      .map(
        d => (d.NNAS ?? 0) + (d['BCCNM & NCAS'] ?? 0) + (d.Recruitment ?? 0) + (d.Immigration ?? 0),
      )
      .sort((a, b) => a - b);

    const overall = {
      title: 'Overall',
      HA: ' ',
      ...this.getDurationStats(overallDurations),
    };

    if (verbose) {
      Object.assign(overall, { count: overallDurations.length, values: overallDurations });
    }
    data.push(overall);

    // Time from the start of their journey to employment
    const timeToHireDurations = durations
      .filter(d => d.Recruitment)
      .map(d => (d.NNAS ?? 0) + (d['BCCNM & NCAS'] ?? 0) + (d.Recruitment ?? 0))
      .sort((a, b) => a - b);
    const timeToHire = {
      title: 'Average time to hire',
      HA: ' ',
      ...this.getDurationStats(timeToHireDurations),
    };
    if (verbose) {
      Object.assign(timeToHire, { count: timeToHireDurations.length, values: timeToHireDurations });
    }
    data.push(timeToHire);

    this.logger.log(
      `Report 9 - Average time with each health authority: returns ${data.length} records`,
      'REPORT',
    );
    return data;
  }

  private getDurationStats(durations: number[] = []) {
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
   * Report 10 - Average time spent on each stage and their major milestones
   *
   * NNAS
   *    Applied to NNAS
   *    Submitted Documents (NNAS Application in Review)
   *    Received NNAS Report
   * BCCNM & NCAS
   *    Applied to BCCNM
   *    Completed English Language Requirement
   *    Referred to NCAS
   *    Completed Computer-Based Assessment (CBA)
   *    Completed Simulation Lab Assessment (SLA)
   *    Completed NCAS
   * Recruitment
   *    Completed pre-screen (includes both outcomes)
   *    Completed interview (includes both outcomes)
   *    Completed reference check (includes both outcomes)
   *    Hired
   * Immigration
   *    Sent First Steps document to candidate
   *    Sent employer documents to HMBC
   *    Submitted application to BC PNP
   *    Received Confirmation of Nomination
   *    Sent Second Steps document to candidate
   *    Submitted Work Permit Application
   *    Immigration Completed
   *
   * - Each stage counts applicants who completed the stage.
   *
   * @param end date of report, YYYY-MM-DD
   * @param verbose if true, include the list of values used to calculate mean, mode, and median.
   */
  async getReport10(toDate: string, verbose = false): Promise<DurationEntry[]> {
    // get all applicants milestones
    const { to } = this.captureFromTo('', toDate);
    this.logger.log(
      `Report 10 - Average time with each milestone: apply filter till ${to} date)`,
      'REPORT',
    );
    const table = await this.reportUtilService.getMilestoneTable(to);

    // get hired applicants job milestones
    const jobMilestones: MilestoneTableEntry[] =
      await this.reportUtilService.getRecruitmentMilestoneTable(to);
    jobMilestones.forEach(m => {
      const applicant = table[m.id];
      // use milestones of the accepted job
      Object.assign(applicant, m);
    });

    const durations = Object.values(table)
      .map(this.reportUtilService.getDurationTableEntry)
      .map(this.reportUtilService.getDurationSummary);

    const data = _.flatten(
      DURATION_STAGES.map(stage => {
        const applicants = durations.filter(d => d[stage[0].stage as keyof DurationSummary]);
        return stage.map(({ stage, milestone }) => {
          const field = (stage || milestone) as keyof DurationSummary;
          const values = applicants.map(d => (d[field] as number) || 0).sort((a, b) => a - b);
          const stat: object = {
            stage: stage || ' ',
            milestone: milestone || ' ',
            ...this.getDurationStats(values),
          };

          // for stage row, add sample values and count
          if (verbose) {
            Object.assign(stat, { count: values.length, values });
          }
          return stat;
        });
      }),
    );
    this.logger.log(
      `Report 10 - Average time with each milestone: returns ${data.length} records`,
      'REPORT',
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
      this.getLicenseApplicants(from, to).then(report5 => ({ report5 })),
      this.getRecruitmentApplicants(statuses, from, to).then(report6 => ({ report6 })),
      this.getImmigrationApplicants(statuses, from, to).then(report7 => ({ report7 })),
      this.getApplicantHAForCurrentPeriodFiscal(statuses, from, to).then(report8 => ({ report8 })),
      this.getReport9(to).then(report9 => ({ report9 })),
      this.getReport10(to).then(report10 => ({ report10 })),
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
