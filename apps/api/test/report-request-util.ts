import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  ApplicantRO,
  Authorities,
  IENApplicantAddStatusDTO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  STATUS,
} from '@ien/common';
import {
  ApplicantOptions,
  getApplicant,
  getHaId,
  getJob,
  getMilestone,
  getStatus,
} from './report-util';
import { IENHaPcn } from 'src/applicant/entity/ienhapcn.entity';
import { ReportService } from 'src/report/report.service';

interface AddMilestoneAndSplitProcess {
  applicantId: string;
  status: STATUS;
  period: { from: string; to: string };
  jobId?: string;
}

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
export const addApplicant = async (
  applicant: IENApplicantCreateUpdateDTO,
): Promise<ApplicantRO | Error> => {
  const { body } = await request(app.getHttpServer()).post('/ien').send(applicant);
  return body;
};

// delete status on applicant
export const deleteApplicantStatus = async (applicantId: string, applicantStatusId: string) => {
  const deleteApplicantStatusURL = `/ien/${applicantId}/status/${applicantStatusId}`;
  await request(app.getHttpServer()).delete(deleteApplicantStatusURL);
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

export const hire = async (id: string, ha: keyof typeof Authorities, start: string) => {
  const ha_pcn = await getHaId(ha);
  const job = await addJob(id, { ha_pcn, recruiter_name: faker.name.fullName() });

  // add hired milestone - should only count hired applicants
  await addMilestone(id, job.id, await getStatus(STATUS.JOB_OFFER_ACCEPTED, start));

  return job;
};

/**
 * Create a batch of applicants
 *
 * @param numberOfApplicants
 * @param options
 */
export const generateApplicants = (
  numberOfApplicants: number,
  options?: ApplicantOptions,
): Promise<(ApplicantRO | Error)[]> => {
  const applicants = Array.from({ length: numberOfApplicants }, () => getApplicant(options));
  return Promise.all(applicants.map(a => addApplicant(a)));
};

/**
 * adds milestones and splits them into new/ old process
 * @param s: ReportService
 * @param data: AddMilestoneAndSplitProcess
 */
export const addMilestoneAndSplitProcess = async (
  s: ReportService,
  data: AddMilestoneAndSplitProcess,
) => {
  const { applicantId, status, period, jobId } = data;

  await addMilestone(applicantId, jobId || '', await getStatus(status));
  const cachedReport = await s.splitReportFourNewOldProcess(period.from, period.to);

  return cachedReport;
};
