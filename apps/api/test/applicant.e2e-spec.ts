require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { validApplicant, applicant, addJob, seedHa, addMilestone, seedUser } from './fixture/ien';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
let jobTempId = 10;
let applicantStatusId = 'NA';

jest.setTimeout(10000);

describe('ApplicantController (e2e)', () => {
  let app: INestApplication;
  let ienHaPcnRepository: Repository<IENHaPcn>;
  let ienUsersRepository: Repository<IENUsers>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Let's add some seed for required master table
    ienHaPcnRepository = moduleFixture.get(getRepositoryToken(IENHaPcn));
    await ienHaPcnRepository.upsert(seedHa, ['id']);

    ienUsersRepository = moduleFixture.get(getRepositoryToken(IENUsers));
    await ienUsersRepository.upsert(seedUser, ['id']);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Add Applicant /ien (POST)', done => {
    request(app.getHttpServer())
      .post('/ien')
      .send(validApplicant)
      .expect(res => {
        const { body } = res;
        applicant.id = body.id;
      })
      .expect(201)
      .end(done);
  });

  it('Duplicate applicant /ien (POST)', done => {
    request(app.getHttpServer())
      .post('/ien')
      .send(validApplicant)
      .expect(res => {
        const { body } = res;
        expect(body.detail).toContain('already exists');
      })
      .expect(400)
      .end(done);
  });

  it('Add second Applicant /ien (POST) ', done => {
    validApplicant.applicant_id += 1;
    validApplicant.last_name = 'notexample';
    request(app.getHttpServer()).post('/ien').send(validApplicant).expect(201).end(done);
  });

  it('Fetch applicants list /ien (GET)', done => {
    request(app.getHttpServer())
      .get('/ien')
      .expect(res => {
        const { body } = res;
        expect(body[1]).toBe(2);
      })
      .expect(200)
      .end(done);
  });

  it('Filter applicants by name /ien?name=notexample (GET)', done => {
    request(app.getHttpServer())
      .get('/ien?name=notexample')
      .expect(res => {
        const { body } = res;
        expect(body[1]).toBe(1);
      })
      .expect(200)
      .end(done);
  });

  it('Add job/competition /ien/:id/job (POST)', done => {
    const addJobUrl = `/ien/${applicant.id}/job`;
    request(app.getHttpServer())
      .post(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        jobTempId = body.id;
      })
      .expect(201)
      .end(done);
  });

  it('Edit job/competition /ien/:id/job/:job (POST)', done => {
    const addJobUrl = `/ien/${applicant.id}/job/${jobTempId}`;
    addJob.job_id = 'HA100MAY11';
    request(app.getHttpServer())
      .put(addJobUrl)
      .send(addJob)
      .expect(res => {
        const { body } = res;
        expect(body.job_id).toBe(addJob.job_id);
      })
      .expect(200)
      .end(done);
  });

  it('Add applicant milestone /ien/:id/status (POST)', done => {
    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = jobTempId;
    request(app.getHttpServer())
      .post(addStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        applicantStatusId = body.id;
      })
      .expect(201)
      .end(done);
  });

  it('Add duplicate applicant milestone /ien/:id/status (POST)', done => {
    const addStatusUrl = `/ien/${applicant.id}/status`;
    addMilestone.job_id = jobTempId;
    request(app.getHttpServer())
      .post(addStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        expect(body.message).toBe('Duplicate milestone with same date found!');
      })
      .expect(400)
      .end(done);
  });

  it('Patch applicant milestone detail /ien/:id/status/:id (POST)', done => {
    const addStatusUrl = `/ien/${applicant.id}/status/${applicantStatusId}`;
    addMilestone.notes = 'Update note';
    request(app.getHttpServer())
      .patch(addStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        expect(body.notes).toBe(addMilestone.notes);
      })
      .expect(200)
      .end(done);
  });

  it('Fetch applicant detail /ien/:id (GET)', done => {
    request(app.getHttpServer())
      .get(`/ien/${applicant.id}?relation=audit`)
      .expect(res => {
        const { body } = res;
        expect(body.jobs.length).toBe(1);
        expect(body.applicant_id).toBe(`${validApplicant.applicant_id - 1}`);
      })
      .expect(200)
      .end(done);
  });

  it('Fetch applicant job list /ien/:id/jobs (GET)', done => {
    request(app.getHttpServer())
      .get(`/ien/${applicant.id}/jobs`)
      .expect(res => {
        const { body } = res;
        expect(body[1]).toBe(1);
      })
      .expect(200)
      .end(done);
  });

  it('Fetch applicant job detail /ien/job/:id (GET)', done => {
    request(app.getHttpServer())
      .get(`/ien/job/${jobTempId}`)
      .expect(res => {
        const { body } = res;
        expect(body.job_id).toBe(addJob.job_id);
        expect(body.recruiter_name).toBe(addJob.recruiter_name);
        expect(body.status_audit.length).toBe(1);
      })
      .expect(200)
      .end(done);
  });
});