import { ApplicantRO, STATUS } from '@ien/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { IENApplicantStatusAudit } from '../src/applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicant } from '../src/applicant/entity/ienapplicant.entity';
import { URLS } from './constants';
import { canActivate } from './override-guard';
import { addApplicant, addMilestone, setApp } from './report-request-util';
import { getApplicant, getStatus } from './report-util';

interface LicenseStat {
  status: string;
  old_status: string;
  new_status: string;
}

describe('Report 5 (e2e)', () => {
  let app: INestApplication;
  let applicantOne: ApplicantRO;
  let applicantTwo: ApplicantRO;
  let applicantThree: ApplicantRO;

  let lastMilestone: IENApplicantStatusAudit;
  let report: LicenseStat[];

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

  it('Report 5 Summary (before adding applicants) - GET', done => {
    request(app.getHttpServer())
      .get(URLS.REPORT5)
      .expect(res => {
        const { body } = res;
        report = body;
        expect(report).toBeDefined();
      })
      .expect(200)
      .end(done);
  });

  it('Report 5 Summary (after adding 1 Full Licence RN) - GET', async () => {
    applicantOne = (await addApplicant(getApplicant())) as ApplicantRO;
    expect(applicantOne.id).toBeDefined();

    await addMilestone(applicantOne.id, '', await getStatus(STATUS.BCCNM_FULL_LICENSE_RN));

    await request(app.getHttpServer())
      .get(URLS.REPORT5)
      .expect(res => {
        const newReport: LicenseStat[] = res.body;
        expect(+newReport[0]?.old_status - +report[0].old_status).toBe(1);
      })
      .expect(200);
  });

  it('Report 5 Summary (after adding 1 Provisional Licence LPN) - GET', async () => {
    applicantTwo = (await addApplicant(getApplicant())) as ApplicantRO;
    expect(applicantTwo.id).toBeDefined();

    await addMilestone(applicantTwo.id, '', await getStatus(STATUS.BCCNM_PROVISIONAL_LICENSE_LPN));

    await request(app.getHttpServer())
      .get(URLS.REPORT5)
      .expect(res => {
        const newReport: LicenseStat[] = res.body;
        expect(+newReport[4].old_status - +report[4].old_status).toBe(1);
      })
      .expect(200);
  });

  it('Report 5 Summary (after adding 1 Provisional Licence RN) - GET', async () => {
    applicantThree = (await addApplicant(getApplicant())) as ApplicantRO;
    expect(applicantThree.id).toBeDefined();

    lastMilestone = await addMilestone(
      applicantThree.id,
      '',
      await getStatus(STATUS.BCCNM_PROVISIONAL_LICENSE_RN),
    );

    await request(app.getHttpServer())
      .get(URLS.REPORT5)
      .expect(res => {
        const newReport: LicenseStat[] = res.body;
        expect(+newReport[3].old_status - +report[3].old_status).toBe(1);
      })
      .expect(200);
  });

  it('Report 5 Summary (after removing 1 Provisional Licence RN) - GET', async () => {
    const deleteStatusUrl = `/ien/${applicantOne.id}/status/${lastMilestone.id}`;

    await request(app.getHttpServer()).delete(deleteStatusUrl).expect(200);

    await request(app.getHttpServer())
      .get(URLS.REPORT5)
      .expect(res => {
        const newReport: LicenseStat[] = res.body;
        expect(newReport[3].new_status).toBe(report[3].new_status);
      })
      .expect(200);
  });
});
