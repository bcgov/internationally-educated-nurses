import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { IENApplicantCreateUpdateDTO, STATUS } from '@ien/common';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import {
  getApplicant,
  getIndexOfStatus,
  getJob,
  getMilestone,
  RECRUITMENT_STAGE_STATUSES,
} from './report-util';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';

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

    const { body: authorities } = await request(app.getHttpServer()).get('/ienmaster/ha-pcn');
    // remove 'Authority' from end of HA strings
    authorities.forEach((e: IENHaPcn) => {
      e.title = e.title.substring(0, e.title.lastIndexOf(' '));
    });
    HA = authorities;
    lastHa = HA[HA.length - 1].title;
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
  const addMilestone = async (id: string, status_id: string, start_date?: string) => {
    const addStatusUrl = `/ien/${id}/status`;
    const milestone = getMilestone({
      status: status_id,
      job_id: jobTempId,
      start_date: start_date,
    });

    const { body } = await request(app.getHttpServer()).post(addStatusUrl).send(milestone);
    applicantId = id;
    applicantStatusId = body.id;
  };

  it('Add Recruitment related statuses for all HAs', async () => {
    const before = await getReport6();

    for (let i = 0; i < HA.length; i++) {
      const applicant = getApplicant();
      applicant.registration_date = '2022-06-01';
      const { id } = await addApplicant(applicant);

      await addJob(id, HA[i].id, i.toString());
      await addMilestone(
        id,
        RECRUITMENT_STAGE_STATUSES[
          STATUS.REFERENCE_CHECK_PASSED as keyof typeof RECRUITMENT_STAGE_STATUSES
        ],
      );
    }

    const after = await getReport6();
    refCheckIndex = getIndexOfStatus(after, STATUS.REFERENCE_CHECK_PASSED);

    for (let i = 0; i < HA.length; i++) {
      expect(Number(after[refCheckIndex][HA[i].title])).toBe(
        Number(before[refCheckIndex][HA[i].title]) + 1,
      );
    }
  });

  it('Add new job/status to applicant with job/status in another HA to Provincial Health Services', async () => {
    const before = await getReport6();
    const phsaIndex = HA.findIndex(ha => ha.title === PHSA);

    await addJob(applicantId, HA[phsaIndex].id, 'TestTwoStatusSameApplicant');
    await addMilestone(
      applicantId,
      RECRUITMENT_STAGE_STATUSES[
        STATUS.INTERVIEW_PASSED as keyof typeof RECRUITMENT_STAGE_STATUSES
      ],
    );

    const after = await getReport6();
    intvwIndex = getIndexOfStatus(after, STATUS.INTERVIEW_PASSED);

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

    await addMilestone(
      applicantId,
      RECRUITMENT_STAGE_STATUSES[
        STATUS.JOB_OFFER_ACCEPTED as keyof typeof RECRUITMENT_STAGE_STATUSES
      ],
    );

    const after = await getReport6();
    jobAcceptedIndex = getIndexOfStatus(after, STATUS.JOB_OFFER_ACCEPTED);

    expect(Number(after[jobAcceptedIndex][PHSA])).toBe(Number(before[jobAcceptedIndex][PHSA]) + 1);
    // should remove all other counts once an applicant accepts job offer
    expect(Number(after[refCheckIndex][lastHa])).toBe(Number(before[refCheckIndex][lastHa]) - 1);
  });
});
