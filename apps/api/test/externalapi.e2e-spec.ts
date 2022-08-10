import { AuthGuard } from '../src/auth/auth.guard';

require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { canActivate } from './override-guard';

jest.setTimeout(10000);

describe('ExternalAPIController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Get the latest successful sync', done => {
    request(app.getHttpServer()).get('/external-api/sync-applicants-audit').expect(200).end(done);
  });
});
