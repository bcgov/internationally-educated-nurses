require('../env');
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

import validSubmissionData from './fixture/validSubmission.json';
import invalidSubmissionDataFirstname from './fixture/invalidSubmission_firstname.json';
import { validationPipeConfig } from 'src/app.config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('successfully saves a valid submission', done => {
    request(app.getHttpServer())
      .post(`/submission`)
      .send(validSubmissionData)
      .expect(201)
      .expect(res => {
        const { body } = res;
        expect(body.confirmationId).toBeDefined();
        expect(body.id).toBeDefined();
      })
      .end(done);
  });

  it('returns a validation error for blank firstName', done => {
    request(app.getHttpServer())
      .post(`/submission`)
      .send(invalidSubmissionDataFirstname)
      .expect(400)
      .expect(res => {
        const { body } = res;

        expect(body.error).toBe('Bad Request');

        const errorObject = body.message[0][0][0];

        expect(errorObject.firstName.matches).toBe('First Name is Required');
        expect(errorObject.firstName.isNotEmpty).toBe('First Name is Required');
        expect(errorObject.firstName.isLength).toBe(
          'First Name must be between 1 and 255 characters',
        );
      })
      .end(done);
  });
});
