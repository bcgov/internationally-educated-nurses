import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { canActivate } from './override-guard';
import {
  addMilestone,
  applicant,
  fullLicenceRN,
  provLicenceLPN,
  provLicenceRN,
  validApplicantForReport,
} from './fixture/reports';

describe('Report 3 (e2e)', () => {
  let app: INestApplication;
  let applicantIdOne: string;
  let applicantIdTwo: string;
  let applicantIdThree: string;

  let applicantStatusId = 'NA';

  const reportFiveUrl = '/reports/applicant/license';

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

  it('Report 5 Summary (before adding applicants) - GET', done => {
    request(app.getHttpServer())
      .get(reportFiveUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += +app.applicant_count;
        });

        expect(total).toBe(0);
      })
      .expect(200)
      .end(done);
  });

  it('Report 5 Summary (after adding 1 Full Licence RN) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdOne;
    validApplicantForReport.last_name = 'Report5';
    validApplicantForReport.email_address = 'test.report5@mailinator.com';
    validApplicantForReport.registration_date = '2022-04-29';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = '';
    addMilestone.status = fullLicenceRN.id;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    await request(app.getHttpServer())
      .get(reportFiveUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += +app.applicant_count;
        });
        expect(body[3].applicant_count).toBe('1');
        expect(total).toBe(1);
      })
      .expect(200);
  });

  it('Report 5 Summary (after adding 1 Provisional Licence LPN) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdTwo;
    validApplicantForReport.last_name = 'Report5.1';
    validApplicantForReport.email_address = 'test.report5.1@mailinator.com';
    validApplicantForReport.registration_date = '2022-07-29';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = '';
    addMilestone.status = provLicenceLPN.id;
    await request(app.getHttpServer()).post(addStatusUrl).send(addMilestone).expect(201);

    await request(app.getHttpServer())
      .get(reportFiveUrl)
      .expect(res => {
        const { body } = res;
        console.log(body);
        let total = 0;
        body.forEach((app: any) => {
          total += +app.applicant_count;
        });
        expect(body[0].applicant_count).toBe('1');
        expect(total).toBe(2);
      })
      .expect(200);
  });

  it('Report 5 Summary (after adding 1 Provisional Licence RN) - GET', async () => {
    validApplicantForReport.applicant_id = applicantIdThree;
    validApplicantForReport.last_name = 'Report5.2';
    validApplicantForReport.email_address = 'test.report5.2@mailinator.com';
    validApplicantForReport.registration_date = '2022-08-19';
    await request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReport)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201);

    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = '';
    addMilestone.status = provLicenceRN.id;
    await request(app.getHttpServer())
      .post(addStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        applicantStatusId = body.id;
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(reportFiveUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += +app.applicant_count;
        });
        expect(body[1].applicant_count).toBe('1');
        expect(total).toBe(3);
      })
      .expect(200);
  });

  it('Report 5 Summary (after removing 1 Provisional Licence RN) - GET', async () => {
    const deleteStatusUrl = `/ien/${applicant.id}/status/${applicantStatusId}`;

    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    await request(app.getHttpServer())
      .get(reportFiveUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += +app.applicant_count;
        });
        expect(body[1].applicant_count).toBe('0');
        expect(total).toBe(2);
      })
      .expect(200);
  });
});
