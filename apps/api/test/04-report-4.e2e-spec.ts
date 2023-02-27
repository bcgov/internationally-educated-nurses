import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { getApplicant, getStatus, reportFourNumberOfApplicants } from './report-util';
import {  haPcnArray } from './fixture/reports';
import { STATUS, LIC_REG_STAGE, BCCNM_LICENSE} from '@ien/common';
import {
  addApplicant,
  addMilestone,
  setApp,
  addJob,
  deleteApplicantStatus
} from './report-request-util';

describe('Report 4 - Number of IEN registrants in the licensing stage', () => {
  // Tracks applicants id's and to later delete status/milestones
  const applicantIds: string[] = [];
  const jobIds: string[] = [];
  let app: INestApplication;

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

    // What the report is expected to look like. Used for comparison at the end of the test
    const expectedResult = before.map((item: { applicants: string; status: string }) => {
      const stat = item.status
      let result = parseInt(item.applicants) + 1;
      // Accounts for other two BCCNM Licenses
      if (stat === 'Granted provisional licensure' || stat === 'Granted full licensure') {
        result++;
      }
      // Withdraw status should not be incremented in report ouput
      else if (stat === STATUS.WITHDREW_FROM_PROGRAM) {
        result--;
      }
      // NCAS count increases with COMPLETED_CBA and COMPLETED_SLA
      // NNAS count increases with RECEIVED_NNAS_REPORT and SUBMITTED_DOCUMENTS
      else if(stat === STATUS.REFERRED_TO_NCAS || stat === STATUS.APPLIED_TO_NNAS) {
        result += 2;
      }
      // Referred to Additional Education makes this report count increase
      else if(stat === STATUS.COMPLETED_ADDITIONAL_EDUCATION) {
        result++
      }
      return {
        ...item,
        applicants: result.toString(),
      };
    });
  
    // Add applicants and give milestones/status
    for (const status of LIC_REG_STAGE) {
      // Job id only needed for WITHDREW_FROM_PROGRAM
      let jobId = "";
      const applicant = await addApplicant(getApplicant());
      applicantIds.push(applicant.id);
    
      if(status === STATUS.WITHDREW_FROM_PROGRAM) {
        const {id} = await addJob(applicant.id, {
          ha_pcn: haPcnArray[0],
          job_id: '148593',
          recruiter_name: 'Test 4',
        });
        jobId = id;
      }
      const milestone = await addMilestone(applicant.id, jobId, await getStatus(status));
      statusIds.push(milestone.id);
    }

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(after).toStrictEqual(expectedResult);

    // Resetting milestones to original
    for (let i = 0; i <= LIC_REG_STAGE.length - 1; i++) {
      await deleteApplicantStatus(applicantIds[i], statusIds[i]);
    } 

  });

   it('Applicants with "Withdrew from IEN program" status does not appear on report', async () => {
    // The report output includes "Withdrew from IEN program" row, which should not increase with WITHDREW_FROM_PROGRAM milestone
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    const milestone = await addMilestone(
      applicantIds[0],
      '',
      await getStatus(STATUS.WITHDREW_FROM_PROGRAM),
    );

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(before).toStrictEqual(after);

    await deleteApplicantStatus(applicantIds[0], milestone.id);
  });

  it('Applicants latest milestone is getting hired, should not show on report', async () => {
    const statusTracker: string[] = [];

    // For comparison at end of test
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // Giving BCCNM Full Licence LPN status
    const fullLicenseStatus = await addMilestone(
      applicantIds[1],
      '',
      await getStatus(STATUS.BCCNM_FULL_LICENCE_LPN),
    );

    statusTracker.push(fullLicenseStatus.id);
    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);
    expect(reportFourNumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN)).toBe('1');

    // Giving job offer accepted milestone
    const { id } = await addJob(applicantIds[1], {
      ha_pcn: haPcnArray[1],
      job_id: '46897',
      recruiter_name: 'Tester',
    });
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
    for (const stat of BCCNM_LICENSE) {
      const milestone = await addMilestone(applicantIds[2], '', await getStatus(stat));
      const { body: afterLicense } = await request(app.getHttpServer()).get(URLS.REPORT4);
      expect(reportFourNumberOfApplicants(afterLicense, stat)).toBe('1');
      await deleteApplicantStatus(applicantIds[2], milestone.id);
    }
  });

  it("NCAS value increases on report for each status Completed CBA or Completed SLA", async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    //Expect the NCAS value to increase by 2
    const expectedResult = before.map((item: { applicants: string; status: string }) => {
      const stat = item.status
      let result = parseInt(item.applicants);
      if(stat === STATUS.REFERRED_TO_NCAS) {
        result+= 2;
      }
      return {
        ...item,
        applicants: result.toString(),
      };
    });

    const job1 = await addJob(applicantIds[3], {
      ha_pcn: haPcnArray[2],
      job_id: '344356',
      recruiter_name: 'Test1',
    });
    const job2 = await addJob(applicantIds[4], {
      ha_pcn: haPcnArray[3],
      job_id: '45678',
      recruiter_name: 'Test2',
    });

    const milestone1 = await addMilestone(applicantIds[3], job1.id, await getStatus(STATUS.COMPLETED_CBA)); 
    const milestone2 = await addMilestone(applicantIds[4], job2.id, await getStatus(STATUS.COMPLETED_SLA)); 

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    await deleteApplicantStatus(applicantIds[3], milestone1.id);
    await deleteApplicantStatus(applicantIds[4], milestone2.id);

    expect(expectedResult).toStrictEqual(after);
  });

  it("NNAS value increases on report for each status Received NNAS Report or Submitted documents", async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    // Expect the NNAS value to increase by 2
    const expectedResult = before.map((item: { applicants: string; status: string }) => {
      const stat = item.status
      let result = parseInt(item.applicants);
      if(stat === STATUS.APPLIED_TO_NNAS) {
        result+= 2;
      }
      return {
        ...item,
        applicants: result.toString(),
      };
    });

    const job1 = await addJob(applicantIds[5], {
      ha_pcn: haPcnArray[3],
      job_id: '34465435',
      recruiter_name: 'Test3',
    });
    const job2 = await addJob(applicantIds[6], {
      ha_pcn: haPcnArray[4],
      job_id: '545343',
      recruiter_name: 'Test4',
    });

    const milestone1 = await addMilestone(applicantIds[5], job1.id, await getStatus(STATUS.RECEIVED_NNAS_REPORT)); 
    const milestone2 = await addMilestone(applicantIds[6], job2.id, await getStatus(STATUS.SUBMITTED_DOCUMENTS)); 

    const { body: after } = await request(app.getHttpServer()).get(URLS.REPORT4);

    expect(expectedResult).toStrictEqual(after);

    await deleteApplicantStatus(applicantIds[3], milestone1.id);
    await deleteApplicantStatus(applicantIds[4], milestone2.id);
  })
});
