import { STATUS } from '@ien/common';
import { randomUUID } from 'crypto';

export const validApplicant = {
  first_name: 'Test',
  last_name: 'Example',
  applicant_id: randomUUID(),
  email_address: 'test.example@mailinator.com',
  phone_number: '77-555-1234',
};

export const applicant = { id: validApplicant.applicant_id };

export const addJob = {
  ha_pcn: '6ad69443-e3a8-3cbc-8cc9-3a05e5b771e4',
  job_id: 'JOB11',
};

export const invalidMilestoneToUpdate = { id: '08ff7e3f-3148-43d3-9740-5a255aa0d5ff' };

export const seedHa = {
  id: '6ad69443-e3a8-3cbc-8cc9-3a05e5b771e4',
  title: 'Fraser Health Authority',
  abbreviation: 'FHA',
};

export const addMilestone = {
  status: STATUS.APPLIED_TO_BCCNM,
  job_id: '08ff7e3f-3148-43d3-9740-6a255aa0d5ff',
  start_date: new Date().toISOString().slice(0, 10),
  notes: 'Test Note',
};

export const seedUser = {
  id: 'a053d04d-db64-4789-b6f9-2e98feb334b2',
  name: 'Test User',
  user_id: 'a053d04d-db64-4789-b6f9-2e98feb334b2',
};
