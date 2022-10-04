require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('IENMasterController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Education title list', done => {
    request(app.getHttpServer()).get('/ienmaster/education').expect(200).end(done);
  });

  it('Health Authorities', done => {
    request(app.getHttpServer()).get('/ienmaster/ha-pcn').expect(200).end(done);
  });

  it('Job locations', done => {
    request(app.getHttpServer()).get('/ienmaster/job-locations').expect(200).end(done);
  });

  it('Job title / Department', done => {
    request(app.getHttpServer()).get('/ienmaster/job-titles').expect(200).end(done);
  });

  it('Application withdraw reasons', done => {
    request(app.getHttpServer()).get('/ienmaster/reasons').expect(200).end(done);
  });

  it('Milestone list', done => {
    request(app.getHttpServer()).get('/ienmaster/status').expect(200).end(done);
  });

  it('Users / Staff list', done => {
    request(app.getHttpServer()).get('/ienmaster/users').expect(200).end(done);
  });
});
