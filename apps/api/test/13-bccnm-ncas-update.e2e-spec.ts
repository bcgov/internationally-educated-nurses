import { addApplicant, setApp } from './report-request-util';

require('../env');

import * as fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import * as path from 'path';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { canActivate } from './override-guard';
import { INestApplication } from '@nestjs/common';
import { AdminService } from '../src/admin/admin.service';
import { BccnmNcasValidationRO } from '../src/admin/ro';
import { getApplicant } from './report-util';
import { ApplicantRO } from '@ien/common';
import { faker } from '@faker-js/faker';
import { utils, writeFileXLSX } from 'xlsx-js-style';
import dayjs from 'dayjs';

describe('BCCNM/NCAS Updates', () => {
  let app: INestApplication;
  let validations: BccnmNcasValidationRO[];

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
    const sheetData = await Promise.all(
      Array(4)
        .fill(0)
        .map(async () => {
          const dto = getApplicant({ between });
          try {
            const applicant = (await addApplicant(dto)) as ApplicantRO;
            return {
              'HMBC Unique ID': applicant.id,
              'Last Name': applicant.name.split(' ')[1],
              'First Name': applicant.name.split(' ')[0],
              Email: applicant.email_address,
              'Date ROS Contract Signed': dayjs(
                faker.date.between(applicant.registration_date ?? between[0], between[1]),
              ).format('YYYY-MM-DD'),
            };
          } catch (e) {
            console.log(e);
          }
        }),
    );
    sheetData.forEach((v, index) => {
      if (index > 1 && v) v['Date ROS Contract Signed'] = '';
    });
    const wb1 = utils.book_new();
    const ws1 = utils.json_to_sheet(sheetData);
    utils.book_append_sheet(wb1, ws1, 'Template - DO NOT EDIT');
    writeFileXLSX(wb1, 'test/fixture/create.xlsx');
    const update = sheetData.slice(0, 2).map(v => ({
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
  });

  it('1 - Validates BCCNM/NCAS update data', () => {
    const filePath = path.join(__dirname, 'fixture/create.xlsx');
    const buffer = fs.readFileSync(filePath);
    app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File)
      .then(data => {
        validations = data;
        console.table(validations);
        expect(data.length).toBe(4);
        expect(data.filter(r => r.message === 'Create').length).toBe(2);
        expect(data.filter(r => r.valid).length).toBe(2);
        expect(data.filter(r => !r.valid).length).toBe(2);
      });
  });

  it('2 - Apply BCCNM/NCAS update data', done => {
    const filePath = path.join(__dirname, 'fixture/create.xlsx');
    const buffer = fs.readFileSync(filePath);
    app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File)
      .then(data => {
        request(app.getHttpServer())
          .post('/admin/apply-bccnm-ncas-updates')
          .send({ data: data.filter(v => v.valid) })
          .expect(response => {
            const { created, updated, ignored } = response.body;
            expect(created).toBe(2);
            expect(updated).toBe(0);
            expect(ignored).toBe(0);
          })
          .end(done);
      });
  });

  it('3 - Validates BCCNM/NCAS update data just with updates', done => {
    const filePath = path.join(__dirname, 'fixture/update.xlsx');
    const buffer = fs.readFileSync(filePath);
    app
      .get(AdminService)
      .validateBccnmNcasUpdates({ buffer } as Express.Multer.File)
      .then(data => {
        console.table(data);
        expect(data.length).toBe(2);
        expect(data.filter(r => r.message === 'Update').length).toBe(2);
        expect(data.filter(r => r.valid).length).toBe(2);
        validations = data;
      })
      .finally(done);
  });
});
