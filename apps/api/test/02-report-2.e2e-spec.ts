import { IENApplicantCreateUpdateDTO } from '@ien/common';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { COUNTRY_OF_EDUCATIONS, getApplicant, getEducation } from './report-util';

describe('Report 2 - Country of Education', () => {
  let app: INestApplication;
  let periods: { from: string; to: string }[];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = module.createNestApplication();

    await app.init();

    const { body: report } = await request(app.getHttpServer()).get(URLS.REPORT1);
    periods = report;
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * count and compare changes for the country of applicant's first item in nursing_educations
   * @param applicant
   * @param from
   * @param to
   * @param expectedDifference
   */
  const testAddEducation = async (
    applicant: IENApplicantCreateUpdateDTO,
    from: string,
    to: string,
    expectedDifference = 1,
  ) => {
    // get initial snapshot of report
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT2);

    // add one applicant with education
    await request(app.getHttpServer()).post(URLS.IEN).send(applicant).expect(201);

    // get updated report
    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT2);

    // check if count has increased by 1
    const periodBefore = before.find((p: any) => p.from === from && p.to === to);
    const periodAfter = after.find((p: any) => p.from === from && p.to === to);
    const country = applicant.nursing_educations[0].country as keyof typeof COUNTRY_OF_EDUCATIONS;
    const countBefore = periodBefore[COUNTRY_OF_EDUCATIONS[country]];
    const countAfter = periodAfter[COUNTRY_OF_EDUCATIONS[country]];

    expect(countAfter - countBefore).toBe(expectedDifference);
  };

  it('Add applicant with education to the first period', async () => {
    // select a period for applicant's registration date
    const { from, to } = periods[0];
    const applicant = getApplicant({ between: [from, to] });
    applicant.nursing_educations.push(getEducation());
    await testAddEducation(applicant, from, to);
  });

  /* it('Add applicant with education to the last period', async () => {
    const { from, to } = periods[periods.length - 1];
    let applicant: IENApplicantCreateUpdateDTO;
    if (from === to) {
      applicant = getApplicant();
      applicant.registration_date = from;
    } else {
      applicant = getApplicant({ between: [from, to] });
    }
    applicant.nursing_educations.push(getEducation());
    await testAddEducation(applicant, from, to);
  }); */

  it('Ignore applicants not in the period', async () => {
    const { from, to } = periods[periods.length - 1];
    const between: [string, string] = [
      dayjs(from).subtract(3, 'month').format('YYYY-MM-DD'),
      dayjs(to).subtract(3, 'month').format('YYYY-MM-DD'),
    ];
    const applicant = getApplicant({ between });
    applicant.nursing_educations.push(getEducation());
    await testAddEducation(applicant, from, to, 0);
  });

  it('Ignore older education', async () => {
    const { from, to } = periods[periods.length - 1];
    const applicant = getApplicant({ between: [from, to] });
    applicant.nursing_educations.push(getEducation({ country: 'uk', year: 2000 }));
    applicant.nursing_educations.push(getEducation({ country: 'us', year: 2010 }));
    await testAddEducation(applicant, from, to, 0);
  });
});
