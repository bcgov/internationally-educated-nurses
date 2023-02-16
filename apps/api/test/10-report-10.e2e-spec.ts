import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import { mean, median, min, mode, round } from 'mathjs';
import { Authorities, STATUS } from '@ien/common';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { ReportController } from '../src/report/report.controller';
import { canActivate } from './override-guard';
import { addApplicant, addMilestone, hire, setApp } from './report-request-util';
import { addDays, clearMilestones, getApplicant, getStatus } from './report-util';

interface MilestoneStat {
  stage: string;
  milestone: string;
  Mean: number;
  Median: number;
  Mode: number;
}

describe('Report 10 - Average Amount of Time with Each Milestone in Stakeholder Group', () => {
  let app: INestApplication;
  let controller: ReportController;
  let report: any[] = [];

  // allowed date range for applicant registration date
  const between: [string, string] = ['2022-01-01', '2022-12-01'];
  // end date of report period
  const to = '2022-12-31';

  // duration of APPLIED_TO_NNAS determines date of SUBMITTED_DOCUMENTS
  const appliedToNNAS = [6, 8, 9, 11, 11];
  // duration of SUBMITTED_DOCUMENTS determines date of JOB_OFFER_ACCEPTED
  const submittedDocs = [21, 31, 43, 54, 65];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = module.createNestApplication();
    await app.init();

    setApp(app);
    controller = module.get<ReportController>(ReportController);

    await clearMilestones();
  });

  afterAll(async () => app.close());

  const getReport = async (to?: string): Promise<MilestoneStat[]> => {
    const toDate = to || dayjs().format('YYYY-MM-DD');
    return (await controller.getAverageTimeOfMilestones(toDate)) as MilestoneStat[];
  };

  it('validates a report with no milestones', async () => {
    report = await getReport();

    // all values should be 0
    const result = report.every(({ Mean, Median, Mode }) => {
      return !Mean && !Median && !Mode;
    });
    expect(result).toBeTruthy();
  });

  it('validates mean, median, and mode for a single milestone type', async () => {
    const applicant = getApplicant({ between });
    const { id } = await addApplicant(applicant);

    // hire applicant
    const daysToBeHired = appliedToNNAS[0] + submittedDocs[0];
    const appliedToNNASDate = '2022-07-01';
    const hiredDate = addDays(appliedToNNASDate, daysToBeHired);
    await hire(id, Authorities.VIHA.id, hiredDate);

    // add milestones
    let duration = appliedToNNAS[0];
    const submittedDoc = addDays(appliedToNNASDate, duration);
    await addMilestone(id, '', await getStatus(STATUS.APPLIED_TO_NNAS, appliedToNNASDate));
    await addMilestone(id, '', await getStatus(STATUS.SUBMITTED_DOCUMENTS, submittedDoc));

    let report = await getReport(to);

    // check APPLIED_TO_NNAS stats
    let { Mean, Mode, Median } = report.find(s => s.milestone === STATUS.APPLIED_TO_NNAS) || {};
    expect(Mean).toBe(duration);
    expect(Mode).toBe(duration);
    expect(Median).toBe(duration);

    // check SUBMITTED_DOCUMENTS stats
    ({ Mean, Mode, Median } = report.find(s => s.milestone === STATUS.SUBMITTED_DOCUMENTS) || {});
    duration = submittedDocs[0];
    expect(Mean).toBe(duration);
    expect(Mode).toBe(duration);
    expect(Median).toBe(duration);

    // check NNAS stats
    ({ Mean, Mode, Median } = report.find(s => s.stage === 'NNAS') || {});
    duration = appliedToNNAS[0] + submittedDocs[0];
    expect(Mean).toBe(duration);
    expect(Mode).toBe(duration);
    expect(Median).toBe(duration);
  });

  it('validates mean, median, and mode for full NNAS stage', async () => {
    for (let i = 1; i < appliedToNNAS.length; i++) {
      const applicant = getApplicant({ between });
      const { id } = await addApplicant(applicant);

      // hire applicant
      const daysToBeHired = appliedToNNAS[i] + submittedDocs[i];
      const appliedToNNASDate = '2022-08-01';
      const hiredDate = addDays(appliedToNNASDate, daysToBeHired);
      await hire(id, 'VIHA', hiredDate);

      // add milestones
      const submittedDoc = addDays(appliedToNNASDate, appliedToNNAS[i]);
      await addMilestone(id, '', await getStatus(STATUS.APPLIED_TO_NNAS, appliedToNNASDate));
      await addMilestone(id, '', await getStatus(STATUS.SUBMITTED_DOCUMENTS, submittedDoc));
    }

    report = await getReport(to);

    // check APPLIED_TO_NNAS stats
    let { Mean, Mode, Median } = report.find(s => s.milestone === STATUS.APPLIED_TO_NNAS) || {};
    expect(Mean).toBe(round(mean(appliedToNNAS), 2));
    expect(Mode).toBe(min(mode(appliedToNNAS)));
    expect(Median).toBe(median(appliedToNNAS));

    // check SUBMITTED_DOCUMENTS stats
    ({ Mean, Mode, Median } = report.find(s => s.milestone === STATUS.SUBMITTED_DOCUMENTS) || {});
    expect(Mean).toBe(round(mean(submittedDocs), 2));
    expect(Mode).toBe(min(mode(submittedDocs)));
    expect(Median).toBe(median(submittedDocs));

    // check NNAS stats
    ({ Mean, Mode, Median } = report.find(s => s.stage === 'NNAS') || {});
    const nnasDurations = appliedToNNAS.map((n, i) => n + submittedDocs[i]);
    expect(Mean).toBe(round(mean(nnasDurations), 2));
    expect(Mode).toBe(min(mode(nnasDurations)));
    expect(Median).toBe(median(nnasDurations));
  });

  it('ignores applicant hired outside of the reporting period', async () => {
    const applicant = getApplicant({ between });
    const { id } = await addApplicant(applicant);

    // hire later than the end of reporting period
    await hire(id, 'VIHA', addDays(to, 10));

    await addMilestone(id, '', await getStatus(STATUS.APPLIED_TO_NNAS, '2022-06-01'));
    await addMilestone(id, '', await getStatus(STATUS.SUBMITTED_DOCUMENTS, '2022-07-01'));

    const newReport = await getReport(to);
    expect(JSON.stringify(report)).toBe(JSON.stringify(newReport));
  });
});
