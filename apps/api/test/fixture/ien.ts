export const validApplicant = {
  first_name: 'Test',
  last_name: 'Example',
  applicant_id: +new Date(),
  email_address: 'test.example@mailinator.com',
  phone_number: '77-555-1234',
};

export const applicant = { id: 'notdefined' };

export const addJob = { ha_pcn: 1, recruiter_name: 'HA Name', job_id: 'JOB11' };

export const testMilestone = { id: 301 };

export const invalidMilestoneToUpdate = { id: '08ff7e3f-3148-43d3-9740-5a255aa0d5ff' };

export const seedHa = { id: 1, title: 'Health Authority', abbreviation: 'ha' };

export const addMilestone = {
  status: testMilestone.id,
  job_id: 1,
  start_date: new Date().toISOString().slice(0, 10),
  notes: 'Test Note',
};

export const seedUser = { id: 'a053d04d-db64-4789-b6f9-2e98feb334b2', name: 'Test User' };
