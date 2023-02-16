import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { getApplicant, getStatus } from './report-util';
import { LICENSE_STATUS, BCCNM_STATUS, jobInput, Report4Item } from './fixture/reports';
import { STATUS } from '@ien/common';
import {
  addApplicant,
  addMilestone,
  setApp,
  addJob,
  deleteApplicantStatus,
} from './report-request-util';

describe('Report 4 - Number of IEN registrants in the licensing stage', () => {
  // Tracks applicants id's and to later delete status/milestones
  const applicantIds: string[] = [];
  let app: INestApplication;

  // Find the number of applicants for the given status
  const report4NumberOfApplicants = (body: Report4Item[], applicantStatus: string | STATUS) => {
    return body.find((e: { status: string }) => {
      return e.status === applicantStatus;
    })?.applicants;
  };

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('Status 200 on report 4 response', async () => {
    const { status } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(status).toBe(200);
  });

  it('Add applicants and give each a different status/milestone', async () => {
    const statusIds: string[] = [];

    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // What the report is expected to look like. Used for comparison
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

    // Add applicants and give milestones/status
    for (const status of Object.values(LICENSE_STATUS)) {
      const applicant = await addApplicant(getApplicant());
      applicantIds.push(applicant.id);
      await addJob(applicant.id, jobInput);
      const milestone = await addMilestone(applicant.id, '', await getStatus(status));
      statusIds.push(milestone.id);
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(after).toStrictEqual(expectedResult);

    // Resetting milestones to original
    for (let i = 0; i <= Object.values(LICENSE_STATUS).length - 1; i++) {
      await deleteApplicantStatus(applicantIds[i], statusIds[i]);
    }
  });

  it('Applicants with "Withdrew from IEN program" status does not appear on report', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    const milestone = await addMilestone(
      applicantIds[0],
      '',
      await getStatus(LICENSE_STATUS.WITHDREW_FROM_PROGRAM),
    );

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(before).toStrictEqual(after);

    await deleteApplicantStatus(applicantIds[0], milestone.id);
  });

  it('Applicants latest milestone is getting hired, should not show on report', async () => {
    const statusTracker: string[] = [];

    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(report4NumberOfApplicants(before, STATUS.BCCNM_FULL_LICENCE_LPN)).toBe('0');

    // Giving BCCNM Full Licence LPN status
    const fullLicenseStatus = await addMilestone(
      applicantIds[1],
      '',
      await getStatus(LICENSE_STATUS.BCCNM_FULL_LICENCE_LPN),
    );

    statusTracker.push(fullLicenseStatus.id);
    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(report4NumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN)).toBe('1');

    // Giving job offer accepted milestone
    const { id } = await addJob(applicantIds[1], jobInput);
    const acceptedMilestone = await addMilestone(
      applicantIds[1],
      id,
      await getStatus(STATUS.JOB_OFFER_ACCEPTED),
    );

    statusTracker.push(acceptedMilestone.id);
    const { body: afterJobAccept } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // With job offer accepted, BCCNM status should not be counted
    expect(afterJobAccept).toStrictEqual(before);

    for (let i = 0; i <= statusTracker.length - 1; i++) {
      await deleteApplicantStatus(applicantIds[1], statusTracker[i]);
    }
  });

  it('Applicant with all 4 licenses and check granted licensure', async () => {
    const { id } = await addJob(applicantIds[2], jobInput);
    for (const stat of Object.values(BCCNM_STATUS)) {
      const milestone = await addMilestone(applicantIds[2], id, await getStatus(stat));

      const { body: afterLicense } = await request(app.getHttpServer()).get(URLS.REPORT4);

      expect(report4NumberOfApplicants(afterLicense, stat)).toBe('1');
      await deleteApplicantStatus(applicantIds[2], milestone.id);
    }
  });
});
