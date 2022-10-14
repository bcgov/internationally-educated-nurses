import { IENApplicantCreateUpdateDTO } from '@ien/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import {
  acceptedOffer,
  addJob,
  addMilestone,
  withdrewFromCompetition,
  withdrewReason,
} from './fixture/reports';
import { getApplicant } from './report-util';

describe('Report 3 - Applicant by Status', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;

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

  const getReport3 = async () => {
    const { body } = await request(app.getHttpServer()).get(URLS.REPORT3);
    return body;
  };

  const addApplicant = async (applicant: IENApplicantCreateUpdateDTO) => {
    const { body } = await request(app.getHttpServer()).post('/ien').send(applicant);
    return body;
  };

  it('Add an active applicant', async () => {
    const before = await getReport3();

    const applicant = getApplicant();
    applicant.registration_date = '2022-06-01';
    await addApplicant(applicant);

    const after = await getReport3();
    expect(after[1].active - before[1].active).toBe(1);
    expect(after[1].total - before[1].total).toBe(1);
  });

  it('Report 3 Summary (after adding 1 withdrawn status OLD) - GET', async () => {
    const before = await getReport3();

    // add an applicant
    const applicant = getApplicant();
    applicant.registration_date = '2022-01-29';
    const { id } = await addApplicant(applicant);

    // add a job competition
    const addJobUrl = `/ien/${id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        jobTempId = body.id;
      })
      .expect(201);

    // add a withdrawal milestone
    const addStatusUrl = `/ien/${id}/status`;
    addMilestone.job_id = jobTempId;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    // check the result
    const after = await getReport3();
    expect(after[0].withdrawn - before[0].withdrawn).toBe(1);
    expect(after[0].total - before[0].total).toBe(1);
  });

  it('Report 3 Summary (after adding 1 withdrawn status NEW) - GET', async () => {
    const before = await getReport3();

    // add an applicant
    const applicant = getApplicant();
    applicant.registration_date = '2022-08-29';
    const { id } = await addApplicant(applicant);

    const addJobUrl = `/ien/${id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(({ body }) => (jobTempId = body.id))
      .expect(201);

    const addStatusUrl = `/ien/${id}/status`;
    addMilestone.job_id = jobTempId;
    addMilestone.status = withdrewFromCompetition.id;
    addMilestone.reason = withdrewReason.id;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    const after = await getReport3();
    expect(after[1].withdrawn - before[1].withdrawn).toBe(1);
    expect(after[1].total - before[1].total).toBe(1);
  });

  it('Report 3 Summary (after adding 1 hired status NEW) - GET', async () => {
    const before = await getReport3();

    const applicant = getApplicant();
    applicant.registration_date = '2022-08-19';
    const { id } = await addApplicant(applicant);

    const addJobUrl = `/ien/${id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .expect(({ body }) => (jobTempId = body.id))
      .send(addJob);

    const addStatusUrl = `/ien/${id}/status`;
    addMilestone.job_id = jobTempId;
    addMilestone.status = acceptedOffer.id;
    const { body } = await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone);
    applicantId = id;
    applicantStatusId = body.id;

    const after = await getReport3();
    expect(after[1].hired - before[1].hired).toBe(1);
    expect(after[1].total - before[1].total).toBe(1);
  });

  it('Report 3 Summary (after removing 1 hired status NEW) - GET', async () => {
    const before = await getReport3();

    const deleteStatusUrl = `/ien/${applicantId}/status/${applicantStatusId}`;

    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    const after = await getReport3();
    expect(after[1].hired - before[1].hired).toBe(-1);
    expect(after[1].total - before[1].total).toBe(0);
  });
});
