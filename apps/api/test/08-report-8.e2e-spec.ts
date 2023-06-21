import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';
import dayjs from 'dayjs';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { addApplicant, addMilestone, getHAs, hire, setApp } from './report-request-util';
import { getApplicant } from './report-util';
import { ApplicantRO, STATUS } from '@ien/common';

describe('Report 8 - Registrants Working in BC', () => {
  let app: INestApplication;
  let applicantId: string;
  let HA: IENHaPcn[] = [];

  const lastYear = dayjs().year() - 1;
  const currentYearFiscal = dayjs(`${dayjs().year()}-04-01`).format('YYYY-MM-DD');
  const lastYearFiscal = dayjs(`${lastYear}-04-01`).format('YYYY-MM-DD');
  const fiscalDate = dayjs().month() >= 3 ? currentYearFiscal : lastYearFiscal;
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
    const { id } = (await addApplicant(applicant)) as ApplicantRO;

    await hire(id, 'FNHA', dayjs().format('YYYY-MM-DD'));

    await addMilestone(id, '', {
      status: STATUS.RECEIVED_WORK_PERMIT,
      start_date: fiscalDate,
    });

    const after = await getReport8();

    // HA count
    expect(Number(after[0]['current_fiscal'])).toBe(Number(before[0]['current_fiscal']) + 1);
    // total count
    expect(Number(after[HA.length]['current_fiscal'])).toBe(
      Number(before[HA.length]['current_fiscal']) + 1,
    );
    expect(Number(after[HA.length]['total'])).toBe(Number(before[HA.length]['total']) + 1);
  });

  it('Add status to current period', async () => {
    const before = await getReport8();

    const applicant = getApplicant();
    applicant.registration_date = '2022-06-01';
    const { id } = (await addApplicant(applicant)) as ApplicantRO;
    applicantId = id;

    await hire(id, 'FHA', dayjs().format('YYYY-MM-DD'));

    await addMilestone(id, '', {
      status: STATUS.RECEIVED_WORK_PERMIT,
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
    await hire(applicantId, 'IHA', dayjs().format('YYYY-MM-DD'));

    await addMilestone(applicantId, '', {
      status: STATUS.RECEIVED_WORK_PERMIT,
      start_date: fiscalDate,
    });
    const after = await getReport8();

    // same applicant, should count only highest/ most recent work permit milestone
    expect(Number(after[1]['total'])).toBe(Number(before[1]['total']) - 1);
    expect(Number(after[2]['total'])).toBe(Number(before[2]['total']) + 1);
    // total count
    expect(Number(after[HA.length]['total'])).toBe(Number(before[HA.length]['total']));
  });

  it('Ignores applicant outside fiscal year', async () => {
    const before = await getReport8();

    const applicant = getApplicant();
    applicant.registration_date = '2020-06-01';
    const { id } = (await addApplicant(applicant)) as ApplicantRO;

    await hire(id, 'VCHA', dayjs().format('YYYY-MM-DD'));

    await addMilestone(id, '', {
      status: STATUS.RECEIVED_WORK_PERMIT,
      start_date: '2021-01-01',
    });
    const after = await getReport8();

    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });
});
