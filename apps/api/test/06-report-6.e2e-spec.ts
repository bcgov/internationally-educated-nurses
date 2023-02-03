import { IENApplicantCreateUpdateDTO } from '@ien/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import {
  getApplicant,
  getJob,
  getMilestone,
  HEALTH_AUTHORITIES,
  RECRUITMENT_STAGE_STATUSES,
} from './report-util';

describe('Report 6 - Registrants in Recruitment Stage', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;

  const PHSA = 'Provincial Health Services';
  const NHA = 'Northern Health';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const getReport6 = async () => {
    const { body } = await request(app.getHttpServer()).get(URLS.REPORT6);
    return body;
  };

  const addApplicant = async (applicant: IENApplicantCreateUpdateDTO) => {
    const { body } = await request(app.getHttpServer()).post('/ien').send(applicant);
    return body;
  };

  // add a job
  const addJob = async (id: string, ha_pcn: string, job_id: string) => {
    const addJobUrl = `/ien/${id}/job`;
    const job = getJob({ ha_pcn, job_id });
    const { body } = await request(app.getHttpServer())
      .post(addJobUrl)
      .expect(({ body }) => (jobTempId = body.id))
      .send(job);

    return body;
  };

  // add a milestone
  const addMilestone = async (id: string, status_id?: string, start_date?: string) => {
    const addStatusUrl = `/ien/${id}/status`;
    const milestone = getMilestone({
      status: status_id || RECRUITMENT_STAGE_STATUSES[1].id,
      job_id: jobTempId || 'WillHaveJobId',
      start_date: start_date,
    });

    const { body } = await request(app.getHttpServer()).post(addStatusUrl).send(milestone);
    applicantId = id;
    applicantStatusId = body.id;
  };

  it('Add Recruitment related statuses for 4 HAs', async () => {
    for (let i = 0; i < 4; i++) {
      const applicant = getApplicant();
      applicant.registration_date = '2022-06-01';
      const { id } = await addApplicant(applicant);

      await addJob(id, HEALTH_AUTHORITIES[i].id, i.toString());
      await addMilestone(id);
    }

    const after = await getReport6();

    expect(Number(after[10][HEALTH_AUTHORITIES[0].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[1].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[2].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[3].name])).toBe(1);
  });

  it('Add new job/status to applicant with job/status in another HA to Provincial Health Services', async () => {
    const before = await getReport6();

    await addJob(applicantId, HEALTH_AUTHORITIES[4].id, 'TestTwoStatusSameApplicant');
    await addMilestone(applicantId, undefined);

    const after = await getReport6();

    expect(Number(before[10][PHSA])).toBe(0);
    expect(Number(after[10][PHSA])).toBe(1);

    // check previous counts for registered statuses
    // to make sure both are counted and prev values are the same
    expect(Number(after[10][HEALTH_AUTHORITIES[0].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[1].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[2].name])).toBe(1);
    expect(Number(after[10][HEALTH_AUTHORITIES[3].name])).toBe(1);
  });

  it('Remove status for Provincial Health Services', async () => {
    const before = await getReport6();

    const deleteStatusUrl = `/ien/${applicantId}/status/${applicantStatusId}`;

    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    const after = await getReport6();

    expect(Number(before[10][PHSA])).toBe(1);
    expect(Number(after[10][PHSA])).toBe(0);
  });

  it('Add Job Accepted to Provincial Health Services', async () => {
    const before = await getReport6();

    await addMilestone(applicantId, RECRUITMENT_STAGE_STATUSES[0].id);

    const after = await getReport6();

    expect(Number(after[4][PHSA])).toBe(1);
    // should remove all other counts once an applicant accepts job offer
    expect(Number(before[10][NHA])).toBe(1);
    expect(Number(after[10][NHA])).toBe(0);
  });
});
