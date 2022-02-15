require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/version (GET)', done => {
    request(app.getHttpServer())
      .get('/version')
      .expect(res => {
        const { body } = res;
        expect(body.buildId).toBeDefined();
        expect(body.info).toBeDefined();
        expect(body.env).toBeDefined();
      })
      .expect(200)
      .end(done);
  });
});
