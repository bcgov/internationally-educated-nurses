require('../env');

import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { INestApplication } from '@nestjs/common';
import { ApplicantRO, BccnmNcasUpdate, STATUS } from '@ien/common';
import { IENApplicantService } from '../src/applicant/ienapplicant.service';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { mockAuthGuardAsSuper } from './override-guard';
import { AdminService } from '../src/admin/admin.service';
import { addApplicant, setApp } from './report-request-util';
import { getApplicant } from './report-util';

describe('BCCNM/NCAS Updates', () => {
  let app: INestApplication;
  const applicants: ApplicantRO[] = [];
  const dataToCreate: BccnmNcasUpdate[] = [];
  const dataToUpdate: BccnmNcasUpdate[] = [];

  const validateMilestone = async (
    app: INestApplication,
    id: string,
    milestone: string,
    start_date: string,
  ) => {
    const service = app.get(IENApplicantService);
    const applicant = await service.getApplicantById(id, { relation: 'audit' });
    const status = applicant.applicant_status_audit.find(s => s.status.status === milestone);
    expect(status?.start_date).toBe(start_date);
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuardAsSuper())
      .compile();

    app = module.createNestApplication();
    await app.init();

    setApp(app);

    const between: [string, string] = ['2020-01-01', '2021-01-01'];
    await Promise.all(
      Array(6)
        .fill(0)
        .map(async () => {
          const dto = getApplicant({ between });
          try {
            const applicant = (await addApplicant(dto)) as ApplicantRO;
            applicants.push(applicant);
            const update: BccnmNcasUpdate = {
              'HMBC Unique ID': applicant.ats1_id as string,
              'Last Name': applicant.name.split(' ')[1],
              'First Name': applicant.name.split(' ')[0],
              Email: applicant.email_address,
              'Date NCAS Assessment Complete': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
              'Date BCCNM Application Complete': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
              'BCCNM Decision Date': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
              'BCCNM Registration Date': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
              'Registration Designation': 'BCCNM Provisional Licence LPN',
              'ISO Code - Education': 'kr',
              'Date ROS Contract Signed': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
            };
            dataToCreate.push(update);
          } catch (e) {
            console.log(e);
          }
        }),
    );

    // make two rows invalid
    dataToCreate.slice(4).forEach(v => {
      v['Date ROS Contract Signed'] = '';
      v['BCCNM Application Complete'] = 'No';
      v['NCAS Assessment Complete'] = '';
      v['ISO Code - Education'] = '';
    });

    dataToUpdate.push(
      ...dataToCreate.map((v, index) =>
        index < 3
          ? v
          : {
              ...v,
              'Date ROS Contract Signed': dayjs(between[0])
                .add(Math.random() * 30, 'days')
                .format('YYYY-MM-DD'),
            },
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('1 - Validates BCCNM/NCAS update data', async () => {
    const data = await app.get(AdminService).validateBccnmNcasUpdates(dataToCreate);

    expect(data.length).toBe(6);
    expect(data.filter(r => r.message === 'No changes').length).toBe(2);
    expect(data.filter(r => r.valid).length).toBe(4);
    expect(data.filter(r => !r.valid).length).toBe(2);
  });

  it('2 - Apply BCCNM/NCAS update data', async () => {
    const data = await app.get(AdminService).validateBccnmNcasUpdates(dataToCreate);
    const response = await request(app.getHttpServer())
      .post('/admin/apply-bccnm-ncas-updates')
      .send({ data: data.filter(v => v.valid) });
    const { created, updated, ignored } = response.body;
    expect(created).toBe(16);
    expect(updated).toBe(0);
    expect(ignored).toBe(0);
    await validateMilestone(
      app,
      applicants[0].id,
      STATUS.SIGNED_ROS,
      dataToCreate[0]['Date ROS Contract Signed'] as string,
    );
    await validateMilestone(
      app,
      applicants[0].id,
      STATUS.COMPLETED_NCAS,
      dayjs().format('YYYY-MM-DD'),
    );
    await validateMilestone(
      app,
      applicants[0].id,
      STATUS.APPLIED_TO_BCCNM,
      dayjs().format('YYYY-MM-DD'),
    );
  });

  it('3 - Validates BCCNM/NCAS update data just with updates', async () => {
    const data = await app.get(AdminService).validateBccnmNcasUpdates(dataToUpdate);

    expect(data.length).toBe(6);
    expect(data.filter(r => r.message === 'No changes').length).toBe(3);
    expect(data.filter(r => r.valid).length).toBe(3);
  });
});
