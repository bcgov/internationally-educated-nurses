import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { STATUS } from '@ien/common';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { getApplicant, getIndexOfStatus, RECRUITMENT_STAGE_STATUSES } from './report-util';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { addApplicant, addJob, addMilestone, getHAs, setApp } from './report-request-util';

describe('Report 6 - Registrants in Recruitment Stage', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;
  let HA: IENHaPcn[] = [];

  let refCheckIndex = 0;
  let intvwIndex = 0;
  let jobAcceptedIndex = 0;

  let lastHa = '';

  const PHSA = 'Provincial Health Services';

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
    lastHa = HA[HA.length - 1].title;

    const report = await getReport6();
    refCheckIndex = getIndexOfStatus(report, STATUS.REFERENCE_CHECK_PASSED);
    intvwIndex = getIndexOfStatus(report, STATUS.INTERVIEW_PASSED);
    jobAcceptedIndex = getIndexOfStatus(report, STATUS.JOB_OFFER_ACCEPTED);
  });

  afterAll(async () => {
    await app.close();
  });

  const getReport6 = async () => {
    const { body } = await request(app.getHttpServer()).get(URLS.REPORT6);
    return body;
  };

  it('Add Recruitment related statuses for all HAs', async () => {
    const before = await getReport6();

    for (let i = 0; i < HA.length; i++) {
      const applicant = getApplicant();
      applicant.registration_date = '2022-06-01';
      const { id } = await addApplicant(applicant);
      applicantId = id;

      const job = await addJob(id, { ha_pcn: HA[i].id, job_id: i.toString(), recruiter_name: '' });
      jobTempId = job.id;

      await addMilestone(id, jobTempId, {
        status: RECRUITMENT_STAGE_STATUSES[STATUS.REFERENCE_CHECK_PASSED],
      });
    }

    const after = await getReport6();

    for (let i = 0; i < HA.length; i++) {
      expect(Number(after[refCheckIndex][HA[i].title])).toBe(
        Number(before[refCheckIndex][HA[i].title]) + 1,
      );
    }
  });

  it('Add new job/status to applicant with job/status in another HA to Provincial Health Services', async () => {
    const before = await getReport6();
    const phsaIndex = HA.findIndex(ha => ha.title === PHSA);

    const job = await addJob(applicantId, {
      ha_pcn: HA[phsaIndex].id,
      job_id: 'TwoStatusApp',
      recruiter_name: '',
    });
    jobTempId = job.id;

    const status = await addMilestone(applicantId, jobTempId, {
      status: RECRUITMENT_STAGE_STATUSES[STATUS.INTERVIEW_PASSED],
    });
    applicantId = applicantId;
    applicantStatusId = status.id;

    const after = await getReport6();

    expect(Number(after[intvwIndex][PHSA])).toBe(Number(before[intvwIndex][PHSA]) + 1);

    // check previous counts for registered statuses
    // to make sure both are counted and prev values are the same
    for (let i = 0; i < HA.length; i++) {
      expect(Number(after[refCheckIndex][HA[i].title])).toBe(
        Number(before[refCheckIndex][HA[i].title]),
      );
    }
  });

  it('Remove status for Provincial Health Services', async () => {
    const before = await getReport6();

    const deleteStatusUrl = `/ien/${applicantId}/status/${applicantStatusId}`;
    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    const after = await getReport6();

    expect(Number(after[intvwIndex][PHSA])).toBe(Number(before[intvwIndex][PHSA]) - 1);
  });

  it('Add Job Accepted to Provincial Health Services', async () => {
    const before = await getReport6();

    await addMilestone(applicantId, jobTempId, {
      status: RECRUITMENT_STAGE_STATUSES[STATUS.JOB_OFFER_ACCEPTED],
    });

    const after = await getReport6();

    expect(Number(after[jobAcceptedIndex][PHSA])).toBe(Number(before[jobAcceptedIndex][PHSA]) + 1);
    // should remove all other counts once an applicant accepts job offer
    expect(Number(after[refCheckIndex][lastHa])).toBe(Number(before[refCheckIndex][lastHa]) - 1);
  });
});
