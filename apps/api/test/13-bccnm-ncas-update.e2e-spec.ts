require('../env');

import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { utils, writeFileXLSX } from 'xlsx-js-style';
import dayjs from 'dayjs';
import { INestApplication } from '@nestjs/common';
import { ApplicantRO, BccnmNcasUpdate, STATUS } from '@ien/common';
import { IENApplicantService } from '../src/applicant/ienapplicant.service';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { canActivate } from './override-guard';
import { AdminService } from '../src/admin/admin.service';
import { addApplicant, setApp } from './report-request-util';
import { getApplicant } from './report-util';

describe('BCCNM/NCAS Updates', () => {
  let app: INestApplication;
  const applicants: ApplicantRO[] = [];
  const updates: BccnmNcasUpdate[] = [];

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
      .useValue({ canActivate })
      .compile();

    app = module.createNestApplication();
    await app.init();

    setApp(app);

    const between: [string, string] = ['2020-01-01', '2021-01-01'];
    await Promise.all(
      Array(4)
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
              'NCAS Assessment Complete': 'Yes',
              'BCCNM Application Complete': 'Yes',
              'Registration Designation': 'BCCNM Provisional Licence LPN',
              'Date ROS Contract Signed': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
            };
            updates.push(update);
          } catch (e) {
            console.log(e);
          }
        }),
    );
    updates.slice(2).forEach(v => {
      v['Date ROS Contract Signed'] = '';
      v['BCCNM Application Complete'] = 'No';
      v['NCAS Assessment Complete'] = '';
    });
    const wb1 = utils.book_new();
    const ws1 = utils.json_to_sheet(updates);
    utils.book_append_sheet(wb1, ws1, 'Template - DO NOT EDIT');
    writeFileXLSX(wb1, 'test/fixture/create.xlsx');
    const update = updates.slice(0, 2).map(v => ({
      ...v,
      'Date ROS Contract Signed': dayjs(v?.['Date ROS Contract Signed'] ?? between[0])
        .add(30, 'days')
        .toDate(),
    }));

    const wb2 = utils.book_new();
    const ws2 = utils.json_to_sheet(update);
    utils.book_append_sheet(wb2, ws2, 'Template - DO NOT EDIT');
    writeFileXLSX(wb2, 'test/fixture/update.xlsx');
  });

  afterAll(async () => {
    await app.close();
    fs.unlinkSync('test/fixture/create.xlsx');
    fs.unlinkSync('test/fixture/update.xlsx');
  });

  it('1 - Validates BCCNM/NCAS update data', async () => {
    const filePath = path.join(__dirname, 'fixture/create.xlsx');
    const buffer = fs.readFileSync(filePath);

    const data = await app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File);

    expect(data.length).toBe(4);
    expect(data.filter(r => r.message === 'No updates').length).toBe(2);
    expect(data.filter(r => r.valid).length).toBe(2);
    expect(data.filter(r => !r.valid).length).toBe(2);
  });

  it('2 - Apply BCCNM/NCAS update data', async () => {
    const filePath = path.join(__dirname, 'fixture/create.xlsx');
    const buffer = fs.readFileSync(filePath);
    const data = await app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File);
    const response = await request(app.getHttpServer())
      .post('/admin/apply-bccnm-ncas-updates')
      .send({ data: data.filter(v => v.valid) });
    const { created, updated, ignored } = response.body;
    expect(created).toBe(6);
    expect(updated).toBe(0);
    expect(ignored).toBe(0);
    await validateMilestone(
      app,
      applicants[0].id,
      STATUS.SIGNED_ROS,
      updates[0]['Date ROS Contract Signed'] as string,
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
    const filePath = path.join(__dirname, 'fixture/update.xlsx');
    const buffer = fs.readFileSync(filePath);
    const data = await app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File);

    expect(data.length).toBe(2);
    expect(data.filter(r => r.message === 'No updates').length).toBe(0);
    expect(data.filter(r => r.valid).length).toBe(2);
  });
});
