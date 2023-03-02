import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import {
  getApplicant,
  getStatus,
  reportFourNumberOfApplicants,
  reportFourExpectedResult,
} from './report-util';
import { STATUS, LIC_REG_STAGE, BCCNM_LICENSE } from '@ien/common';
import { addApplicant, addMilestone, setApp, addJob, getHAs } from './report-request-util';

describe('Report 4 - Number of IEN registrants in the licensing stage', () => {
  // Tracks applicants id's and to later delete status/milestones
  const applicantIdsOldProcess: string[] = [];
  const applicantIdsNewProcess: string[] = [];
  let app: INestApplication;
  let haPcn: string;

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
    let temp = await getHAs();
    haPcn = temp[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Status 200 on report 4 response', async () => {
    const { status } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(status).toBe(200);
  });

  it('Add applicants and give each a different status/milestone (old process)', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // What the report is expected to look like. Only looks at old process
    const expectedResult = reportFourExpectedResult(before, false);

    // Add applicants and give milestones/status
    for (const status of LIC_REG_STAGE) {
      const applicant = await addApplicant(getApplicant({ between: ['2022-05-29', '2022-06-19'] }));
      applicantIdsOldProcess.push(applicant.id);
      await addMilestone(applicant.id, '', await getStatus(status));
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(after).toStrictEqual(expectedResult);
  });

  it('New applicant process values does not affect older values', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // What the report should look like using new process. Should not change already expected
    // values from previous test
    const expectedResult = reportFourExpectedResult(before, true);

    // Add applicants and give milestones/status
    for (const status of LIC_REG_STAGE) {
      const applicant = await addApplicant(getApplicant({ between: ['2023-02-01', '2023-02-25'] }));
      applicantIdsNewProcess.push(applicant.id);
      await addMilestone(applicant.id, '', await getStatus(status));
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(after).toStrictEqual(expectedResult);
  });

  it('Applicants with "Withdrew from IEN program" status does not appear on report', async () => {
    // The report output includes "Withdrew from IEN program" row,
    // which should not increase with WITHDREW_FROM_PROGRAM milestone
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    const withdrawBefore = reportFourNumberOfApplicants(
      before,
      STATUS.WITHDREW_FROM_COMPETITION,
      false,
    );

    await addMilestone(
      applicantIdsOldProcess[0],
      '',
      await getStatus(STATUS.WITHDREW_FROM_PROGRAM),
    );

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const withdrawAfter = reportFourNumberOfApplicants(
      after,
      STATUS.WITHDREW_FROM_COMPETITION,
      false,
    );
    expect(withdrawBefore).toStrictEqual(withdrawAfter);
  });

  it('Applicant given BCCNM full license status should increase count on report', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const licenseBefore = reportFourNumberOfApplicants(
      before,
      STATUS.BCCNM_FULL_LICENCE_LPN,
      false,
    );
    // Giving BCCNM Full Licence LPN status
    await addMilestone(
      applicantIdsOldProcess[1],
      '',
      await getStatus(STATUS.BCCNM_FULL_LICENCE_LPN),
    );

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const licenseAfter = reportFourNumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN, false);

    expect(licenseAfter).toBe((+licenseBefore! + 1).toString());
  });

  it('BCCNM applicant given hired milestone decreases BCCNM value', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    const licenseBefore = reportFourNumberOfApplicants(
      before,
      STATUS.BCCNM_FULL_LICENCE_LPN,
      false,
    );
    const { id } = await addJob(applicantIdsOldProcess[1], {
      ha_pcn: haPcn,
      job_id: '46897',
      recruiter_name: 'Tester',
    });
    await addMilestone(applicantIdsOldProcess[1], id, await getStatus(STATUS.JOB_OFFER_ACCEPTED));

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    const licenseAfter = reportFourNumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN, false);
    // When the applicant gets hired they should be subtracted from the report value
    expect(licenseAfter).toBe((+licenseBefore! - 1).toString());
  });

  it('Applicant with all 4 licenses and check granted licensure', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    for (const status of BCCNM_LICENSE) {
      const licenseBefore = reportFourNumberOfApplicants(before, status, false);
      await addMilestone(applicantIdsOldProcess[2], '', await getStatus(status));
      const { body: afterLicense } = await request(app.getHttpServer()).get(URLS.REPORT4);
      const licenseAfter = reportFourNumberOfApplicants(afterLicense, status, false);
      expect(licenseAfter).toBe((+licenseBefore! + 1).toString());
    }
  });

  it('NCAS value increases on report for each status Completed CBA or Completed SLA', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const ncasBefore = reportFourNumberOfApplicants(before, STATUS.REFERRED_TO_NCAS, false);

    await addMilestone(applicantIdsOldProcess[3], '', await getStatus(STATUS.COMPLETED_CBA));
    await addMilestone(applicantIdsOldProcess[4], '', await getStatus(STATUS.COMPLETED_SLA));

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const ncasAfter = reportFourNumberOfApplicants(after, STATUS.REFERRED_TO_NCAS, false);

    expect(ncasBefore).toStrictEqual((+ncasAfter! - 2).toString());
  });

  it('NNAS report value increases for each status Received NNAS Report or Submitted documents', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const nnasBefore = reportFourNumberOfApplicants(before, STATUS.APPLIED_TO_NNAS, false);

    await addMilestone(applicantIdsOldProcess[5], '', await getStatus(STATUS.RECEIVED_NNAS_REPORT));
    await addMilestone(applicantIdsOldProcess[6], '', await getStatus(STATUS.SUBMITTED_DOCUMENTS));

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    const nnasAfter = reportFourNumberOfApplicants(after, STATUS.APPLIED_TO_NNAS, false);

    expect(nnasBefore).toStrictEqual((+nnasAfter! - 2).toString());
  });
});
