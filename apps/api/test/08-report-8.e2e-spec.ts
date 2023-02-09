import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { addApplicant, addJob, addMilestone, getHAs, setApp } from './report-request-util';
import { getApplicant, getStatusId } from './report-util';
import { STATUS } from '@ien/common';
import dayjs from 'dayjs';

describe('Report 8 - Registrants Working in BC', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;
  let HA: IENHaPcn[] = [];
  const lastYear = dayjs().year() - 1;
  const fiscalDate = dayjs(`${lastYear}-06-06`).format('YYYY-MM-DD');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    setApp(app);
    HA = await getHAs();
  });

  afterAll(async () => {
    await app.close();
  });

  const getReport8 = async () => {
    const { body } = await request(app.getHttpServer()).get(URLS.REPORT8);
    return body;
  };

  it('Add status to fiscal year', async () => {
    const before = await getReport8();

    const applicant = getApplicant();
    applicant.registration_date = '2022-06-01';
    const { id } = await addApplicant(applicant);

    const job = await addJob(id, { ha_pcn: HA[0].id, job_id: '0', recruiter_name: '' });

    // add hired milestone - should only count hired applicants
    await addMilestone(id, job.id, {
      status: await getStatusId(STATUS.JOB_OFFER_ACCEPTED),
    });

    await addMilestone(id, '', {
      status: await getStatusId(STATUS.RECEIVED_WORK_PERMIT),
      start_date: fiscalDate,
    });
    const after = await getReport8();

    // HA count
    expect(Number(after[0]['current_fiscal'])).toBe(Number(before[0]['current_fiscal'] + 1));
    // total count
    expect(Number(after[HA.length]['current_fiscal'])).toBe(
      Number(before[HA.length]['current_fiscal'] + 1),
    );
    expect(Number(after[HA.length]['total'])).toBe(Number(before[HA.length]['total'] + 1));
  });

  it('Add status to current period', async () => {
    const before = await getReport8();

    const applicant = getApplicant();
    applicant.registration_date = '2022-06-01';
    const { id } = await addApplicant(applicant);
    applicantId = id;

    const job = await addJob(id, { ha_pcn: HA[1].id, job_id: '1', recruiter_name: '' });

    // add hired milestone - should only count hired applicants
    await addMilestone(id, job.id, {
      status: await getStatusId(STATUS.JOB_OFFER_ACCEPTED),
    });

    await addMilestone(id, '', {
      status: await getStatusId(STATUS.RECEIVED_WORK_PERMIT),
      start_date: dayjs().format('YYYY-MM-DD'),
    });
    const after = await getReport8();

    // HA count
    expect(Number(after[1]['current_fiscal'])).toBe(Number(before[1]['current_fiscal']) + 1);
    // total count
    expect(Number(after[HA.length]['current_fiscal'])).toBe(
      Number(before[HA.length]['current_fiscal']) + 1,
    );
    expect(Number(after[HA.length]['total'])).toBe(Number(before[HA.length]['total']) + 1);
  });

  it('Add duplicate status to different job for same applicant', async () => {
    const before = await getReport8();

    const job = await addJob(applicantId, { ha_pcn: HA[2].id, job_id: '1', recruiter_name: '' });

    // add hired milestone - should only count hired applicants
    await addMilestone(applicantId, job.id, {
      status: await getStatusId(STATUS.JOB_OFFER_ACCEPTED),
    });

    await addMilestone(applicantId, '', {
      status: await getStatusId(STATUS.RECEIVED_WORK_PERMIT),
      start_date: fiscalDate,
    });
    const after = await getReport8();

    // same applicant, should count only highest/ most recent work permit milestone
    expect(Number(after[1]['total'])).toBe(Number(before[1]['total']) - 1);
    expect(Number(after[2]['total'])).toBe(Number(before[2]['total']) + 1);
    // total count
    expect(Number(after[HA.length]['total'])).toBe(Number(before[HA.length]['total']));
  });
});
