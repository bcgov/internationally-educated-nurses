import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import { mean, median, min, mode, round } from 'mathjs';
import {
  ApplicantRO,
  Authorities,
  BCCNM_NCAS_STAGE,
  IMMIGRATION_STAGE,
  NNAS_STAGE,
  RECRUITMENT_STAGE,
  STATUS,
} from '@ien/common';
import { AppModule } from '../src/app.module';
import { IENApplicantController } from '../src/applicant/ienapplicant.controller';
import { AuthGuard } from '../src/auth/auth.guard';
import { ReportController } from '../src/report/report.controller';
import { mockAuthGuardAsSuper } from './override-guard';
import { addJob, addMilestone, generateApplicants, setApp } from './report-request-util';
import { addDays, clearMilestones, generateDurations, getHaId, getStatus } from './report-util';

interface StageStat {
  title: string;
  HA: string;
  Mean: number;
  Median: number;
  Mode: number;
  count?: number;
  values?: number[];
}

describe('Report 9 - Average Amount of Time with Each Stakeholder Group', () => {
  let app: INestApplication;
  let controller: ReportController;
  let applicantController: IENApplicantController;

  // allowed date range for applicant registration date
  const between: [string, string] = ['2022-01-01', '2022-07-01'];
  // end date of report period
  const to = '2022-12-31';
  const ha = 'VIHA';

  let report: StageStat[];

  const numberOfApplicants = 10;
  let applicants: ApplicantRO[];

  // durations
  const durations = generateDurations(numberOfApplicants, Object.values(STATUS));
  const nnas = NNAS_STAGE.map(status => durations[status])
    .filter(v => v)
    .reduce((a, c) => c.map((v, i) => v + (a[i] || 0)), []);
  const bccnmNcas = BCCNM_NCAS_STAGE.map(status => durations[status])
    .filter(v => v)
    .reduce((a, c) => c.map((v, i) => v + (a[i] || 0)), []);

  const index = RECRUITMENT_STAGE.findIndex(s => s === STATUS.JOB_OFFER_ACCEPTED);
  const jobStage = RECRUITMENT_STAGE.slice(0, index + 1);
  const recruitments = jobStage
    .map(status => durations[status])
    .filter(v => v)
    .reduce((a, c) => c.map((v, i) => v + (a[i] || 0)), []);
  const immigrations = IMMIGRATION_STAGE.map(status => durations[status])
    .filter(v => v)
    .reduce((a, c) => c.map((v, i) => v + (a[i] || 0)), []);

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuardAsSuper())
      .compile();

    app = module.createNestApplication();
    await app.init();

    setApp(app);
    controller = module.get<ReportController>(ReportController);
    applicantController = module.get<IENApplicantController>(IENApplicantController);

    await clearMilestones();
  });

  afterAll(async () => app.close());

  // create applicants and all major milestones
  const seedApplicants = async () => {
    applicants = (await generateApplicants(numberOfApplicants, { between })) as ApplicantRO[];

    for (let i = 0; i < numberOfApplicants; i++) {
      const applicant = applicants[i];
      const { id } = applicant;

      let preStartDate = dayjs(
        applicant.registration_date || faker.date.between(...between),
      ).format('YYYY-MM-DD');
      const job = await addJob(id, {
        ha_pcn: await getHaId(ha),
        job_location: [1],
      });

      const generateStageMilestones = async (stage: STATUS[]) => {
        for (let j = 0; j < stage.length; j++) {
          const status = stage[j];

          if (!durations[status]) continue;
          const duration = durations[status][i];
          // hire applicant
          const startDate = addDays(preStartDate, duration);
          const jobId = RECRUITMENT_STAGE.includes(status) ? job.id : '';
          await addMilestone(id, jobId, await getStatus(status, startDate));
          preStartDate = startDate;
          if (status === STATUS.JOB_OFFER_ACCEPTED) break;
        }
      };

      await generateStageMilestones(NNAS_STAGE);
      await generateStageMilestones(BCCNM_NCAS_STAGE);
      await generateStageMilestones(jobStage);
      await generateStageMilestones(IMMIGRATION_STAGE);
    }
  };

  const getReport = async (to?: string): Promise<StageStat[]> => {
    const toDate = to || dayjs().format('YYYY-MM-DD');
    return (await controller.getAverageTimeWithEachStakeholderGroup(toDate, true)) as StageStat[];
  };

  it('validates a report with no milestones', async () => {
    const report = await getReport();

    // all values should be 0
    const result = report.every(({ Mean, Median, Mode }) => {
      return !Mean && !Median && !Mode;
    });

    expect(result).toBeTruthy();
  });

  it('validates NNAS stages', async () => {
    await seedApplicants();
    report = await getReport(to);

    const { Mean, Mode, Median } = report.find(s => s.title === 'NNAS') || {};

    expect(Mean).toBe(round(mean(nnas), 2));
    expect(Mode).toBe(min(mode(nnas)));
    expect(Median).toBe(median(nnas));
  });

  it('validates BCCNM & NCAS stage', async () => {
    const { Mean, Mode, Median } = report.find(s => s.title === 'BCCNM & NCAS') || {};

    expect(Mean).toBe(round(mean(bccnmNcas), 2));
    expect(Mode).toBe(min(mode(bccnmNcas)));
    expect(Median).toBe(median(bccnmNcas));
  });

  it('validates recruitment stage', async () => {
    const { Mean, Mode, Median } = report.find(s => s.HA === Authorities[ha].name) || {};

    expect(Mean).toBe(round(mean(recruitments), 2));
    expect(Mode).toBe(min(mode(recruitments)));
    expect(Median).toBe(median(recruitments));
  });

  it('validates immigration stage', async () => {
    const { Mean, Mode, Median } = report.find(s => s.title === 'Immigration') || {};

    expect(Mean).toBe(round(mean(immigrations), 2));
    expect(Mode).toBe(min(mode(immigrations)));
    expect(Median).toBe(median(immigrations));
  });

  it('validates overall stats', async () => {
    const { Mean, Mode, Median } = report.find(s => s.title === 'Overall') || {};
    const overalls = nnas.map((v, i) => v + bccnmNcas[i] + recruitments[i] + immigrations[i]);

    expect(Mean).toBe(round(mean(overalls), 2));
    expect(Mode).toBe(min(mode(overalls)));
    expect(Median).toBe(median(overalls));
  });
});
