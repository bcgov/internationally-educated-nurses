import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import dayjs from 'dayjs';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { getApplicant } from './report-util';

describe('Report 1 - Number of New IENs', () => {
  let app: INestApplication;

  const totalPeriods = Math.floor(dayjs().diff(dayjs('2022-05-02'), 'day') / 28 + 1);

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

  // check report 1 summary for updated data after adding 2 applicants
  it('Add new applicants', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT1);
    console.log(before, totalPeriods);
    expect(before.length).toBe(totalPeriods);

    const totalBefore = before.reduce((a: any, c: { applicants: any }) => a + c.applicants, 0);

    for (const regDate of ['2022-05-29', '2022-06-19']) {
      // for period 1 and 2
      const applicant = getApplicant();
      applicant.registration_date = regDate;
      await request(app.getHttpServer()).post('/ien').send(applicant).expect(201);
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT1);
    const totalAfter = after.reduce((a: any, c: { applicants: any }) => a + c.applicants, 0);

    expect(totalAfter - totalBefore).toBe(2);
    expect(after[0].applicants - before[0].applicants).toBe(1); // period 1
    expect(after[1].applicants - before[1].applicants).toBe(1); // period 2
  });
});
