require('../env');

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { BccnmNcasUpdate, EmployeeRO, RoleSlug, STATUS } from '@ien/common';
import { AppModule } from '../src/app.module';
import { ExternalAPIService } from '../src/applicant/external-api.service';
import { AuthGuard } from '../src/auth/auth.guard';
import { SyncApplicantsResultDTO } from '../src/applicant/dto';
import { AdminService } from '../src/admin/admin.service';
import { ReportService } from '../src/report/report.service';
import { IENApplicantService } from '../src/applicant/ienapplicant.service';
import { mockAuthGuard } from './override-guard';
import atsApplicants from './fixture/ats-applicants.json';
import { seedUser } from './fixture/ien';

describe('ExternalAPIController (e2e)', () => {
  let app: INestApplication;
  const admin = {
    user_id: seedUser.id,
    roles: [{ id: 1, slug: RoleSlug.Admin }],
  } as EmployeeRO;

  const TEST_COUNT = 4;
  const BCCNM_NCAS_MILESTONES = [STATUS.COMPLETED_NCAS, STATUS.APPLIED_TO_BCCNM];
  const testApplicants = atsApplicants
    .filter(({ milestones }) =>
      milestones.every(({ name }) => !BCCNM_NCAS_MILESTONES.includes(name as STATUS)),
    )
    .slice(0, TEST_COUNT);
  const numOfApplicants = atsApplicants.length;
  const numOfMilestones = atsApplicants.reduce((a, c) => a + c.milestones.length, 0);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard(admin))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Gets the latest successful sync', done => {
    request(app.getHttpServer()).get('/external-api/sync-applicants-audit').expect(200).end(done);
  });

  it('Syncs IEN applicants with ATS', async () => {
    app.get(ExternalAPIService).fetchApplicantsFromATS = jest.fn().mockReturnValue(atsApplicants);
    const resp = await request(app.getHttpServer()).get('/external-api/save-applicant');
    const { result } = resp.body as SyncApplicantsResultDTO;
    expect(result.applicants.total).toBe(numOfApplicants);
    expect(result.applicants.processed).toBe(numOfApplicants);
    expect(result.milestones.total).toBe(numOfMilestones);
    expect(result.milestones.created).toBe(numOfMilestones);
  });

  const createBccnmNcasUpdates = (): BccnmNcasUpdate[] => {
    return testApplicants.map(applicant => {
      return {
        'HMBC Unique ID': `${applicant.ats1_id}`,
        'Last Name': applicant.last_name,
        'First Name': applicant.first_name,
        Email: applicant.email_address,
        'NCAS Assessment Complete': 'Yes',
        'BCCNM Application Complete': dayjs(faker.date.past(2)).format('YYYY-MM-DD'),
        'Registration Designation': 'BCCNM Provisional Licence LPN',
        'Date ROS Contract Signed': dayjs(faker.date.past(1)).format('YYYY-MM-DD'),
      };
    });
  };

  it(`Doesn't overwrite BCCNM/NCAS milestones but does ROS updated by spreadsheet`, async () => {
    // create ROS, BCCNM/NCAS milestones by spreadsheet
    const adminService = app.get(AdminService);
    const bccnmNcasUpdates = createBccnmNcasUpdates();
    const data = await adminService.validateBccnmNcasUpdates(bccnmNcasUpdates);
    await adminService.applyBccnmNcasUpdates(admin, { data });

    // add ROS, BCCNM/NCAS milestone to ATS applicants
    const statuses = [STATUS.SIGNED_ROS, ...BCCNM_NCAS_MILESTONES];
    const statusIdMap = await app.get(ReportService).getStatusMap();

    testApplicants.forEach(({ milestones }) => {
      statuses.forEach(status => {
        const date = faker.date.past(Math.random());
        milestones.push({
          id: statusIdMap[status],
          name: status,
          start_date: dayjs(date)
            .add(Math.random() * 10, 'days')
            .format('YYYY-MM-DD'),
          created_date: dayjs(date).format('YYYY-MM-DD'),
        });
      });
    });

    const resp = await request(app.getHttpServer()).get('/external-api/save-applicant');
    const { result } = resp.body as SyncApplicantsResultDTO;
    expect(result.applicants.total).toBe(numOfApplicants);
    expect(result.applicants.processed).toBe(numOfApplicants);

    const { total, updated, created, dropped } = result.milestones;
    const newNumOfMilestones = atsApplicants.reduce((a, c) => a + c.milestones.length, 0);
    expect(total).toBe(newNumOfMilestones);
    expect(total).toBe(updated + created + dropped);

    // BCCNM/NCAS milestones should be dropped for the test applicants
    expect(dropped).toBe(testApplicants.length * 2);

    // ATS overrides ROS updated by sheets
    expect(updated).toBe(testApplicants.length);

    // Validate start_dates
    await Promise.all(
      testApplicants.map(async atsApplicant => {
        const applicant = await app
          .get(IENApplicantService)
          .getApplicantById(atsApplicant.applicant_id, { relation: 'audit' });

        // check if ROS milestones are overwritten
        const rosMilestone = atsApplicant.milestones.find(m => m.name === STATUS.SIGNED_ROS);
        const updatedRosMilestone = applicant.applicant_status_audit.find(
          m => m.status.status === STATUS.SIGNED_ROS,
        );
        expect(rosMilestone?.start_date).toBe(updatedRosMilestone?.start_date);

        // check if BCCNM/NCAS milestones are intact
        BCCNM_NCAS_MILESTONES.map(status => {
          const milestone = atsApplicant.milestones.find(m => m.name === status);
          const updatedMilestone = applicant.applicant_status_audit.find(
            m => m.status.status === status,
          );
          expect(milestone?.start_date).not.toBe(updatedMilestone?.start_date);
        });
      }),
    );
  });
});
