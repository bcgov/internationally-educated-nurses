import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { addApplicant, addJob, addMilestone, getHAs, setApp } from './report-request-util';
import { STATUS } from '@ien/common';
import {
  getApplicant,
  IMMIGRATION_STAGE_STATUSES,
  getIndexOfStatus,
  RECRUITMENT_STAGE_STATUSES,
} from './report-util';

describe('Report 7 - Registrants in Immigration Stage', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;
  let HA: IENHaPcn[] = [];

  let firstStepDocIndex = 0;
  let permitIndex = 0;

  let lastHa = '';

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
    lastHa = HA[HA.length - 1].title;
  });

  afterAll(async () => {
    await app.close();
  });

  const getReport7 = async () => {
    const { body } = await request(app.getHttpServer()).get(URLS.REPORT7);
    return body;
  };

  it('Add Immigration related statuses for all HAs with Job Offer Accepted', async () => {
    const before = await getReport7();

    for (let i = 0; i < HA.length; i++) {
      const applicant = getApplicant();
      applicant.registration_date = '2022-06-01';
      const { id } = await addApplicant(applicant);
      applicantId = id;

      const job = await addJob(id, { ha_pcn: HA[i].id, job_id: i.toString(), recruiter_name: '' });
      jobTempId = job.id;

      // add hired milestone - should only count hired applicants
      await addMilestone(id, jobTempId, {
        status:
          RECRUITMENT_STAGE_STATUSES[
            STATUS.JOB_OFFER_ACCEPTED as keyof typeof RECRUITMENT_STAGE_STATUSES
          ],
      });

      const status = await addMilestone(id, '', {
        status:
          IMMIGRATION_STAGE_STATUSES[
            STATUS.SENT_FIRST_STEPS_DOCUMENT as keyof typeof IMMIGRATION_STAGE_STATUSES
          ],
      });
      applicantStatusId = status.id;
    }

    const after = await getReport7();
    firstStepDocIndex = getIndexOfStatus(after, STATUS.SENT_FIRST_STEPS_DOCUMENT);

    for (let i = 0; i < HA.length; i++) {
      expect(Number(after[firstStepDocIndex][HA[i].title])).toBe(
        Number(before[firstStepDocIndex][HA[i].title]) + 1,
      );
    }
  });

  it('Add higher immigration status', async () => {
    const before = await getReport7();

    const status = await addMilestone(applicantId, jobTempId, {
      status:
        IMMIGRATION_STAGE_STATUSES[
          STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER as keyof typeof IMMIGRATION_STAGE_STATUSES
        ],
    });
    applicantStatusId = status.id;

    const after = await getReport7();
    permitIndex = getIndexOfStatus(after, STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER);

    expect(Number(after[permitIndex][lastHa])).toBe(Number(before[permitIndex][lastHa]) + 1);

    // should take highest milestone from immigration stage
    expect(Number(after[firstStepDocIndex][lastHa])).toBe(
      Number(before[firstStepDocIndex][lastHa] - 1),
    );
  });

  it('Remove Immigration status', async () => {
    const before = await getReport7();

    const deleteStatusUrl = `/ien/${applicantId}/status/${applicantStatusId}`;
    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    const after = await getReport7();

    expect(Number(after[permitIndex][lastHa])).toBe(Number(before[permitIndex][lastHa]) - 1);
  });

  it('Add Immigration related status without Job Offer Accepted', async () => {
    const before = await getReport7();

    const applicant = getApplicant();
    applicant.registration_date = '2022-06-01';
    const { id } = await addApplicant(applicant);
    applicantId = id;

    const job = await addJob(id, { ha_pcn: HA[0].id, job_id: '246', recruiter_name: '' });
    jobTempId = job.id;

    await addMilestone(id, '', {
      status:
        IMMIGRATION_STAGE_STATUSES[
          STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER as keyof typeof IMMIGRATION_STAGE_STATUSES
        ],
    });

    const after = await getReport7();
    permitIndex = getIndexOfStatus(after, STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER);

    // should not be counted, should only look for hired applicants
    expect(Number(after[permitIndex][HA[0].title])).toBe(Number(before[permitIndex][HA[0].title]));
  });
});
