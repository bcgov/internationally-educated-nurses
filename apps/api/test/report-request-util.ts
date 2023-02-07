import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import {
  IENApplicantAddStatusDTO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
} from '@ien/common';
import { getJob, getMilestone } from './report-util';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';

let app: INestApplication;

export const setApp = (nestApp: INestApplication) => {
  app = nestApp;
};

// get list of all Health Authorities
export const getHAs = async () => {
  const { body: authorities } = await request(app.getHttpServer()).get('/ienmaster/ha-pcn');
  // remove 'Authority' from end of HA strings
  authorities.forEach((e: IENHaPcn) => {
    e.title = e.title.substring(0, e.title.lastIndexOf(' '));
  });

  return authorities;
};

// add new applicant
export const addApplicant = async (applicant: IENApplicantCreateUpdateDTO) => {
  const { body } = await request(app.getHttpServer()).post('/ien').send(applicant);
  return body;
};

// add a job
export const addJob = async (id: string, j: IENApplicantJobCreateUpdateDTO) => {
  const addJobUrl = `/ien/${id}/job`;
  const job = getJob({
    ha_pcn: j.ha_pcn,
    job_id: j.job_id || '',
    recruiter_name: j.recruiter_name,
  });
  const { body } = await request(app.getHttpServer()).post(addJobUrl).send(job);

  return body;
};

// add a milestone
export const addMilestone = async (id: string, job_id: string, s: IENApplicantAddStatusDTO) => {
  const addStatusUrl = `/ien/${id}/status`;
  const milestone = getMilestone({
    status: s.status,
    job_id,
    start_date: s.start_date,
  });

  const { body } = await request(app.getHttpServer()).post(addStatusUrl).send(milestone);
  return body;
};
