import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { canActivate } from './override-guard';
import { validApplicantForReportOne } from './fixture/ien';

describe('Report Controller (e2e)', () => {
  let app: INestApplication;
  let applicanIdOne: string;
  let applicanIdTwo: string;

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

  it('Add Applicant /ien (POST)', done => {
    validApplicantForReportOne.applicant_id = applicanIdOne;
    request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReportOne)
      .expect(201)
      .end(done);
  });

  it('Add second Applicant /ien (POST)', done => {
    validApplicantForReportOne.applicant_id = applicanIdTwo;
    validApplicantForReportOne.last_name = 'notreport';
    validApplicantForReportOne.email_address = 'test.report2@mailinator.com';
    validApplicantForReportOne.registration_date = '2022-05-29';
    request(app.getHttpServer())
      .post('/ien')
      .send(validApplicantForReportOne)
      .expect(201)
      .end(done);
  });

  it('Report 1 Summary - GET', done => {
    const reportOneUrl = '/reports/applicant/registered';
    const totalPeriods = Math.round(dayjs().diff(dayjs('2022-05-02'), 'day') / 28);

    request(app.getHttpServer())
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
      .expect(200)
      .end(done);
  });
});
