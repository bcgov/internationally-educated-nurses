import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { getApplicant, getJob, getMilestone } from './report-util';
import { IENApplicantCreateUpdateDTO } from '@ien/common/src/dto';
import { statusArray, statusNames, applicantStatus } from './fixture/reports';
import { IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Report 4 - Number of IEN registrants in the licensing stage', () => {
  let app: INestApplication;
  let jobTempId = '';
  let applicantStatusId = 'NA';
  let applicantId: string;
  let status: request.Response;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    status = await request(app.getHttpServer()).get('/ienmaster/status');
  });

  afterAll(async () => {
    await app.close();
  });

  const addApplicant = async (applicant: IENApplicantCreateUpdateDTO) => {
    const { body } = await request(app.getHttpServer()).post('/ien').send(applicant);
    return body;
  };

  const addJob = async (id: string, j: IENApplicantJobCreateUpdateDTO) => {
    const addJobUrl = `/ien/${id}/job`;
    const job = getJob({ ha_pcn: j.ha_pcn, job_id: j.job_id, recruiter_name: j.recruiter_name });
    const { body } = await request(app.getHttpServer())
      .post(addJobUrl)
      .expect(({ body }) => (jobTempId = body.id))
      .send(job);

    return body;
  };

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

  it('Status 200 on report 4 response', async () => {
    const { status } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(status).toBe(200);
  });

  const deleteApplicantStatus = async (applicantId: string, applicantStatusId: string) => {
    const deleteApplicantStatusURL = `/ien/${applicantId}/status/${applicantStatusId}`;
    await request(app.getHttpServer()).delete(deleteApplicantStatusURL);
  };

  it('Add applicants and give each a different status/milestone', async () => {
    const statusIds: string[] = [];
    const applicantIds: string[] = [];
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // Increments the applicants count for each status
    const expectedResult = before.map((item: { applicants: string; status: string }) => {
      let result = parseInt(item.applicants) + 1;
      // Accounts for other two BCCNM Licenses
      if (
        item.status === 'Granted provisional licensure' ||
        item.status === 'Granted full licensure'
      ) {
        result++;
        // Withdrew applicants are not counted
      } else if (item.status === 'Withdrew from IEN program') {
        result--;
      }
      return {
        ...item,
        applicants: result.toString(),
      };
    });

    for (const status of applicantStatus) {
      const newApplicant = getApplicant();
      const applicant = await addApplicant(newApplicant);
      applicantIds.push(applicant.id);
      const jobInput: IENApplicantJobCreateUpdateDTO = {
        ha_pcn: '6ad69443-e3a8-3cbc-8cc9-3a05e5b771e4',
        job_id: '148593',
        recruiter_name: 'Test 4',
      };
      await addJob(applicant.id, jobInput);
      await addMilestone(applicant.id, status);
      statusIds.push(applicantStatusId);
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(after).toStrictEqual(expectedResult);

    // Resetting milestones to original (so test 5 passes)
    for (let i = 0; i <= applicantStatus.length - 1; i++) {
      await deleteApplicantStatus(applicantIds[i], statusIds[i]);
    }
  });

  it('Applicants with "Withdrew from IEN program" status does not appear on report', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    await addMilestone(applicantId, 'f84a4167-a636-4b21-977c-f11aefc486af');

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(before).toStrictEqual(after);

    await deleteApplicantStatus(applicantId, applicantStatusId);
  });

  it('applicants latest milestone is getting hired, should not show on report', async () => {
    const statusArray: string[] = [];

    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const numberOfLicensesBefore: number = parseInt(
      before.find((e: { status: string }) => {
        return e.status === 'BCCNM Full Licence LPN';
      }).applicants,
    );
    expect(numberOfLicensesBefore).toBe(0);

    // Giving BCCNM Full Licence LPN status
    await addMilestone(applicantId, '632374e6-ca2f-0baa-f994-3a05e77c118a');
    statusArray.push(applicantStatusId);
    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const numberOfLicensesAfter: number = parseInt(
      after.find((e: { status: string }) => {
        return e.status === 'BCCNM Full Licence LPN';
      }).applicants,
    );
    expect(numberOfLicensesAfter).toBe(1);

    // Giving job offer accepted milestone
    await addMilestone(applicantId, '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2');
    statusArray.push(applicantStatusId);
    const { body: afterJobAccept } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(afterJobAccept).toStrictEqual(before);

    for (let i = 0; i <= statusArray.length - 1; i++) {
      await deleteApplicantStatus(applicantId, statusArray[i]);
    }
  });

  it('Applicant with all 4 licenses and check granted licensure', async () => {
    for (let i = 0; i <= statusArray.length - 1; i++) {
      await addMilestone(applicantId, statusArray[i]);

      const { body: afterLicense } = await request(app.getHttpServer()).get(URLS.REPORT4);

      const numberOfLicensesAfter: number = parseInt(
        afterLicense.find((e: { status: string }) => {
          return e.status === statusNames[i];
        }).applicants,
      );
      expect(numberOfLicensesAfter).toBe(1);
      await deleteApplicantStatus(applicantId, applicantStatusId);
    }
  });
});
