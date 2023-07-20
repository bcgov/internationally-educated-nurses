import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepository, Repository } from 'typeorm';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import {
  getApplicant,
  getStatus,
  reportFourNumberOfApplicants,
  reportFourExpectedResult,
  getIndexOfStatus,
} from './report-util';
import { STATUS, LIC_REG_STAGE, BCCNM_LICENSE, ApplicantRO } from '@ien/common';
import {
  addApplicant,
  addMilestone,
  setApp,
  addJob,
  getHAs,
  addMilestoneAndSplitProcess,
} from './report-request-util';
import { ReportCacheEntity } from 'src/report/entity/report-cache.entity';
import { ReportService } from 'src/report/report.service';
import { ReportFourItem } from './report-types';

describe('Report 4 - Number of IEN registrants in the licensing stage', () => {
  // Tracks applicants id's and to later delete status/milestones
  const applicantIdsOldProcess: string[] = [];
  const applicantIdsNewProcess: string[] = [];

  let reportFourObj: Partial<ReportCacheEntity> = { report_number: 4 };

  let app: INestApplication;
  let reportCacheRepository: Repository<ReportCacheEntity>;
  let reportService: ReportService;

  let periods: { from: string; to: string }[];
  let haPCN: string;
  let url = '';
  let lastPeriod = 0;

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
    haPCN = temp[0].id;

    reportService = moduleFixture.get<ReportService>(ReportService);

    const { body: report } = await request(app.getHttpServer()).get(URLS.REPORT1);

    // hard set period to be current period moving forward
    lastPeriod = report.length - 1;
    periods = [{ from: report[lastPeriod].from, to: report[lastPeriod].to }];
    url = URLS.REPORT4 + `?period=${lastPeriod + 1}`;

    // set up cached table
    reportCacheRepository = getRepository(ReportCacheEntity);
    reportFourObj.report_period = lastPeriod + 1;
    reportFourObj.report_data = JSON.stringify(
      await reportService.splitReportFourNewOldProcess(periods[0].from, periods[0].to),
    );
    const cachedReport = await reportCacheRepository.upsert(reportFourObj, ['id']);
    reportFourObj.id = cachedReport.identifiers[0].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Status 200 on report 4 response', async () => {
    const { status } = await request(app.getHttpServer()).get(url);
    expect(status).toBe(200);
  });

  // update table report 4 endpoint reads from
  const updateCachedReport = async (data: ReportFourItem[]) => {
    reportFourObj.report_data = JSON.stringify(data);
    await reportCacheRepository.upsert(reportFourObj, ['id']);
  };

  it('Add applicants and give each a different status/milestone (old process)', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);

    // What the report is expected to look like. Only looks at old process
    const expectedResult = reportFourExpectedResult(before, false);

    // Add applicants and give milestones/status
    for (const status of LIC_REG_STAGE) {
      const applicant = (await addApplicant(
        getApplicant({ between: ['2022-05-29', '2022-06-19'] }),
      )) as ApplicantRO;
      applicantIdsOldProcess.push(applicant.id);
      await addMilestone(applicant.id, '', await getStatus(status));
    }

    await updateCachedReport(expectedResult);

    const { body: after } = await request(app.getHttpServer()).get(url);

    expect(after).toStrictEqual(expectedResult);
  });

  it('New applicant process values does not affect older values', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);

    // What the report should look like using new process. Should not change already expected
    // values from previous test
    const expectedResult = reportFourExpectedResult(before, true);

    // Add applicants and give milestones/status
    for (const status of LIC_REG_STAGE) {
      const applicant = (await addApplicant(
        getApplicant({ between: ['2023-02-01', '2023-02-25'] }),
      )) as ApplicantRO;
      applicantIdsNewProcess.push(applicant.id);
      await addMilestone(applicant.id, '', await getStatus(status));
    }

    await updateCachedReport(expectedResult);

    const { body: after } = await request(app.getHttpServer()).get(url);

    expect(after).toStrictEqual(expectedResult);
  });

  it.skip('Applicants with "Withdrew from IEN program" status does not appear on report', async () => {
    // The report output includes "Withdrew from IEN program" row,
    // which should not increase with WITHDREW_FROM_PROGRAM milestone
    const { body: before } = await request(app.getHttpServer()).get(url);

    const updatedReport = await addMilestoneAndSplitProcess(reportService, {
      applicantId: applicantIdsOldProcess[0],
      status: STATUS.WITHDREW_FROM_PROGRAM,
      period: periods[0],
    });
    await updateCachedReport(updatedReport);

    const { body: after } = await request(app.getHttpServer()).get(url);

    const beforeWithdrawnRow = getIndexOfStatus(before, STATUS.WITHDREW_FROM_PROGRAM);
    const afterWithdrawnRow = getIndexOfStatus(after, STATUS.WITHDREW_FROM_PROGRAM);

    expect(before[beforeWithdrawnRow]).toStrictEqual(after[afterWithdrawnRow]);
  });

  it('Applicant given BCCNM full license status should increase count on report', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);
    const licenseBefore = reportFourNumberOfApplicants(
      before,
      STATUS.BCCNM_FULL_LICENCE_LPN,
      false,
    );

    // Giving BCCNM Full Licence LPN status
    const updatedReport = await addMilestoneAndSplitProcess(reportService, {
      applicantId: applicantIdsOldProcess[1],
      status: STATUS.BCCNM_FULL_LICENCE_LPN,
      period: periods[0],
    });
    await updateCachedReport(updatedReport);

    const { body: after } = await request(app.getHttpServer()).get(url);
    const licenseAfter = reportFourNumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN, false);

    expect(licenseAfter).toBe((+licenseBefore! + 1).toString());
  });

  it('BCCNM applicant given hired milestone decreases BCCNM value', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);
    const licenseBefore = reportFourNumberOfApplicants(
      before,
      STATUS.BCCNM_FULL_LICENCE_LPN,
      false,
    );
    const { id } = await addJob(applicantIdsOldProcess[1], {
      ha_pcn: haPCN,
      job_id: '46897',
      job_location: [1],
    });

    const updatedReport = await addMilestoneAndSplitProcess(reportService, {
      applicantId: applicantIdsOldProcess[1],
      status: STATUS.JOB_OFFER_ACCEPTED,
      period: periods[0],
      jobId: id,
    });
    await updateCachedReport(updatedReport);

    const { body: after } = await request(app.getHttpServer()).get(url);

    const licenseAfter = reportFourNumberOfApplicants(after, STATUS.BCCNM_FULL_LICENCE_LPN, false);
    // When the applicant gets hired they should be subtracted from the report value
    expect(licenseAfter).toBe((+licenseBefore! - 1).toString());
  });
  // Skipping because requirements for this part are unclear.
  // New report will not double count applicants with multiple license
  // TODO: Clarify what should and should not be counted
  it.skip('Applicant with all 4 licenses and check granted licensure', async () => {
    const { body: before } = await request(app.getHttpServer()).get(URLS.REPORT4);

    for (const status of BCCNM_LICENSE) {
      const licenseBefore = reportFourNumberOfApplicants(before, status, false);

      const updatedReport = await addMilestoneAndSplitProcess(reportService, {
        applicantId: applicantIdsOldProcess[2],
        status,
        period: periods[0],
      });
      await updateCachedReport(updatedReport);

      const { body: afterLicense } = await request(app.getHttpServer()).get(url);
      const licenseAfter = reportFourNumberOfApplicants(afterLicense, status, false);
      expect(licenseAfter).toBe((+licenseBefore! + 1).toString());
    }
  });

  it('NCAS value increases on report for each status Completed CBA or Completed SLA', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);
    const ncasBefore = reportFourNumberOfApplicants(before, STATUS.REFERRED_TO_NCAS, false);

    await addMilestone(applicantIdsOldProcess[3], '', await getStatus(STATUS.COMPLETED_CBA));
    await addMilestone(applicantIdsOldProcess[4], '', await getStatus(STATUS.COMPLETED_SLA));

    const updatedReport = await reportService.splitReportFourNewOldProcess(
      periods[0].from,
      periods[0].to,
    );
    await updateCachedReport(updatedReport);

    const { body: after } = await request(app.getHttpServer()).get(url);
    const ncasAfter = reportFourNumberOfApplicants(after, STATUS.REFERRED_TO_NCAS, false);

    expect(ncasBefore).toStrictEqual((+ncasAfter! - 2).toString());
  });

  it('NNAS report value increases for each status Received NNAS Report or Submitted documents', async () => {
    const { body: before } = await request(app.getHttpServer()).get(url);
    const nnasBefore = reportFourNumberOfApplicants(before, STATUS.APPLIED_TO_NNAS, false);

    await addMilestone(applicantIdsOldProcess[5], '', await getStatus(STATUS.RECEIVED_NNAS_REPORT));
    await addMilestone(applicantIdsOldProcess[6], '', await getStatus(STATUS.SUBMITTED_DOCUMENTS));

    const updatedReport = await reportService.splitReportFourNewOldProcess(
      periods[0].from,
      periods[0].to,
    );
    await updateCachedReport(updatedReport);

    const { body: after } = await request(app.getHttpServer()).get(url);
    const nnasAfter = reportFourNumberOfApplicants(after, STATUS.APPLIED_TO_NNAS, false);

    expect(nnasBefore).toStrictEqual((+nnasAfter! - 2).toString());
  });
});
