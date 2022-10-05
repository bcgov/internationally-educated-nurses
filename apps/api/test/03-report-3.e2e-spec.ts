import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { canActivate } from './override-guard';
import {
  acceptedOffer,
  addJob,
  addMilestone,
  applicant,
  validApplicantForReport,
  withdrewFromCompetition,
  withdrewReason,
} from './fixture/reports';

describe('Report 3 (e2e)', () => {
  let app: INestApplication;
  let applicantIdOne: string;
  let applicantIdTwo: string;
  let applicantIdThree: string;
  let jobTempId = '';
  let applicantStatusId = 'NA';

  const reportThreeUrl = '/reports/applicant/hired-withdrawn-active';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    applicantIdOne = randomUUID();
    applicantIdTwo = randomUUID();
    applicantIdThree = randomUUID();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Report 3 Summary (before adding applicants) - GET', done => {
    request(app.getHttpServer())
      .get(reportThreeUrl)
      .expect(res => {
        const { body } = res;
        expect(body[0].total).toBe('0');
        expect(body[1].active).toBe('2');
      })
      .expect(200)
      .end(done);
  });

  it('Report 3 Summary (after adding 1 withdrawn L/R status OLD) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdOne;
    validApplicantForReport.last_name = 'Report3';
    validApplicantForReport.email_address = 'test.report3@mailinator.com';
    validApplicantForReport.registration_date = '2022-01-29';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addJobUrl = `/ien/${applicant.id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        jobTempId = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = jobTempId;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    await request(app.getHttpServer())
      .get(reportThreeUrl)
      .expect(res => {
        const { body } = res;
        expect(body[0].withdrawn).toBe('1');
      })
      .expect(200);
  });

  it('Report 3 Summary (after adding 1 withdrawn Recr status NEW) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdTwo;
    validApplicantForReport.last_name = 'Report3.1';
    validApplicantForReport.email_address = 'test.report3.1@mailinator.com';
    validApplicantForReport.registration_date = '2022-08-29';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addJobUrl = `/ien/${applicant.id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        jobTempId = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = jobTempId;
    addMilestone.status = withdrewFromCompetition.id;
    addMilestone.reason = withdrewReason.id;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    await request(app.getHttpServer())
      .get(reportThreeUrl)
      .expect(res => {
        const { body } = res;
        expect(body[1].withdrawn).toBe('1');
        expect(body[1].total).toBe('3');
      })
      .expect(200);
  });

  it('Report 3 Summary (after adding 1 hired status NEW) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdThree;
    validApplicantForReport.last_name = 'Report3.2';
    validApplicantForReport.email_address = 'test.report3.2@mailinator.com';
    validApplicantForReport.registration_date = '2022-08-19';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addJobUrl = `/ien/${applicant.id}/job`;
    await request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        jobTempId = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = jobTempId;
    addMilestone.status = acceptedOffer.id;
    await request(app.getHttpServer())
      .post(addStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        applicantStatusId = body.id;
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(reportThreeUrl)
      .expect(res => {
        const { body } = res;
        expect(body[1].hired).toBe('1');
        expect(body[1].total).toBe('4');
      })
      .expect(200);
  });

  it('Report 3 Summary (after removing 1 hired status NEW) - GET', async () => {
    const deleteStatusUrl = `/ien/${applicant.id}/status/${applicantStatusId}`;

    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    await request(app.getHttpServer())
      .get(reportThreeUrl)
      .expect(res => {
        const { body } = res;
        expect(body[1].hired).toBe('0');
        expect(body[1].total).toBe('4');
      })
      .expect(200);
  });
});
