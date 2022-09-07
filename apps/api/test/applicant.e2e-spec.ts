import { AuthGuard } from '../src/auth/auth.guard';

require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import {
  validApplicant,
  applicant,
  addJob,
  seedHa,
  addMilestone,
  seedUser,
  invalidMilestoneToUpdate,
} from './fixture/ien';
import { IENUsers } from 'src/applicant/entity/ienusers.entity';
import { canActivate } from './override-guard';
import { randomUUID } from 'crypto';
let jobTempId = 10;
let applicantStatusId = 'NA';

describe('ApplicantController (e2e)', () => {
  let app: INestApplication;
  let ienHaPcnRepository: Repository<IENHaPcn>;
  let ienUsersRepository: Repository<IENUsers>;
  let applicanIdOne: string;
  let applicanIdTwo: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    applicanIdOne = randomUUID();
    applicanIdTwo = randomUUID();

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
    validApplicant.applicant_id = applicanIdOne;
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
        expect(body.message).toContain('already');
      })
      .expect(400)
      .end(done);
  });

  it('Add second Applicant /ien (POST) ', done => {
    validApplicant.applicant_id = applicanIdTwo;
    validApplicant.last_name = 'notexample';
    validApplicant.email_address = 'test.example2@mailinator.com';
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

  it('Delete applicant fail, Applicant milestone not found /ien/:id/status/:id (DELETE)', done => {
    const dummyId = '8435ef30-7af3-4ec2-8aed-2662209301c5';
    const uri = `/ien/${applicant.id}/status/${dummyId}`;
    addMilestone.job_id = jobTempId;
    request(app.getHttpServer()).delete(uri).expect(404).end(done);
  });

  it('Delete applicant milestone initiated by different owner not permitted /ien/:id/status/:id (DELETE)', done => {
    const uri = `/ien/${applicant.id}/status/${applicantStatusId}`;
    addMilestone.job_id = jobTempId;
    request(app.getHttpServer()).delete(uri).set({ user: 2 }).expect(400).end(done);
  });

  it('Delete applicant milestone /ien/:id/status/:id (DELETE)', done => {
    const uri = `/ien/${applicant.id}/status/${applicantStatusId}`;
    addMilestone.job_id = jobTempId;
    request(app.getHttpServer()).delete(uri).expect(200).end(done);
  });

  it('Add new applicant milestone /ien/:id/status (POST)', done => {
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

  it('Patch applicant milestone detail /ien/:id/status/:id (PATCH)', done => {
    const patchStatusUrl = `/ien/${applicant.id}/status/${applicantStatusId}`;
    addMilestone.notes = 'Update note';
    request(app.getHttpServer())
      .patch(patchStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        expect(body.notes).toBe(addMilestone.notes);
      })
      .expect(200)
      .end(done);
  });

  it('Patch applicant milestone detail fail, status/milestone not found /ien/:id/status/:id (PATCH)', done => {
    const patchStatusUrl = `/ien/${applicant.id}/status/${invalidMilestoneToUpdate.id}`;
    addMilestone.notes = 'Update note fail';
    request(app.getHttpServer())
      .patch(patchStatusUrl)
      .send(addMilestone)
      .expect(res => {
        const { body } = res;
        expect(body.message).toBe('Provided status/milestone record not found');
      })
      .expect(404)
      .end(done);
  });

  it('Fetch applicant detail /ien/:id (GET)', done => {
    request(app.getHttpServer())
      .get(`/ien/${applicant.id}?relation=audit`)
      .expect(res => {
        const { body } = res;
        expect(body.jobs.length).toBe(1);
        expect(body.applicant_id).toBe(`${applicanIdOne}`);
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
