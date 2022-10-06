import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { canActivate } from './override-guard';
import { validApplicantForReport } from './fixture/reports';

describe('Report 1 (e2e)', () => {
  let app: INestApplication;
  let applicanIdOne: string;
  let applicanIdTwo: string;

  const reportOneUrl = '/reports/applicant/registered';
  const totalPeriods = Math.round(dayjs().diff(dayjs('2022-05-02'), 'day') / 28);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    applicanIdOne = randomUUID();
    applicanIdTwo = randomUUID();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // check report 1 summary before adding any data
  it('Report 1 Summary (before adding applicants) - GET', done => {
    request(app.getHttpServer())
      .get(reportOneUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += app.applicants;
        });

        expect(body.length).toBe(totalPeriods);
        expect(total).toBe(0);
      })
      .expect(200)
      .end(done);
  });

  // check report 1 summary for updated data after adding 2 applicants
  it('Report 1 Summary (after adding two applicants) - GET', async () => {
    validApplicantForReport.applicant_id = applicanIdOne;
    await request(app.getHttpServer()).post('/ien').send(validApplicantForReport).expect(201);

    validApplicantForReport.applicant_id = applicanIdTwo;
    validApplicantForReport.last_name = 'notreport';
    validApplicantForReport.email_address = 'test.report2@mailinator.com';
    validApplicantForReport.registration_date = '2022-05-29';
    await request(app.getHttpServer()).post('/ien').send(validApplicantForReport).expect(201);

    await request(app.getHttpServer())
      .get(reportOneUrl)
      .expect(res => {
        const { body } = res;

        let total = 0;
        body.forEach((app: any) => {
          total += app.applicants;
        });

        expect(body.length).toBe(totalPeriods);
        expect(total).toBe(2);
        expect(body[0].applicants).toBe(1);
        expect(body[1].applicants).toBe(1);
      })
      .expect(200);
  });
});
