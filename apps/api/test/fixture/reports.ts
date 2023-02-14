import { randomUUID } from 'crypto';

export const validApplicantForReport = {
  first_name: 'Test',
  last_name: 'Report1',
  applicant_id: randomUUID(),
  email_address: 'test.report1@mailinator.com',
  phone_number: '77-555-1234',
  registration_date: '2022-06-19',
};

export const applicant = { id: validApplicantForReport.applicant_id };

export const withdrewFromProgram = { id: 'f84a4167-a636-4b21-977c-f11aefc486af' };
export const acceptedOffer = { id: '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2' };
export const withdrewFromCompetition = { id: '3fd4f2b0-5151-d7c8-6bbc-3a0601b5e1b0' };
export const withdrewReason = { id: 'a1e0e2c1-e272-468a-8f7a-28686b750cae' };
export const fullLicenceRN = { id: '18aa32c3-a6a4-4431-8283-89931c141fde' };
export const provLicenceLPN = { id: '91f55faa-c71d-83c8-4f10-3a05e778afbc' };
export const provLicenceRN = { id: 'd2656957-ec58-15c9-1e21-3a05e778dc8e' };

export const addMilestone = {
  status: withdrewFromProgram.id,
  job_id: '08bb7e3f-3148-43d3-9740-6a255aa0d5ff',
  start_date: new Date().toISOString().slice(0, 10),
  notes: 'Test Note 1',
  reason: '',
};

// Report 4 data

export const statusArray = [
  '632374e6-ca2f-0baa-f994-3a05e77c118a',
  '18aa32c3-a6a4-4431-8283-89931c141fde',
  '91f55faa-c71d-83c8-4f10-3a05e778afbc',
  'd2656957-ec58-15c9-1e21-3a05e778dc8e',
];
export const statusNames = [
  'BCCNM Full Licence LPN',
  'BCCNM Full Licence RN',
  'BCCNM Provisional Licence LPN',
  'BCCNM Provisional Licence RN',
];

export const applicantStatus = [
  'e68f902c-8440-4a9c-a05f-2765301de800',
  '8a9b0d13-f5d7-4be3-8d38-11e5459f9e9a',
  'da06889e-55a1-4ff2-9984-80ae23d7e44b',
  'ead2e076-df00-4dab-a0cc-5a7f0bafc51a',
  '06e2d762-05ba-4667-93d2-7843d3cf9fc5',
  '59263418-77ea-411f-894d-c84b5e1f710f',
  '0d6bcfe1-fb00-45cb-a9c6-c6a53da12e62',
  'b0d38aa5-b776-4033-97f7-9894e9b33a3c',
  'd9ad22cd-7629-67ea-5734-3a05e77a47f6',
  '36b0cacf-acd1-6bc5-3e4c-3a05e77a79c9',
  '632374e6-ca2f-0baa-f994-3a05e77c118a',
  '18aa32c3-a6a4-4431-8283-89931c141fde',
  '91f55faa-c71d-83c8-4f10-3a05e778afbc',
  'd2656957-ec58-15c9-1e21-3a05e778dc8e',
  '4189ca04-c1e1-4c22-9d6b-8afd80130313',
  'ca858996-d1ad-2fe3-d8d3-3a05e77c9a2a',
  '5b4173e1-e750-9b85-9464-3a05e77d4547',
  'f84a4167-a636-4b21-977c-f11aefc486af',
  'b93e7bf6-5f2b-43fd-b4b7-58c42aa02bfa',
  '73a4b092-ae7e-de91-17e1-3a05e7864830',
  'dfcfa87a-40f9-ec41-2afa-3a0601a9ce32',
  'b5452d40-7dfd-d614-0319-3a0601aa0749',
  '9e97a1b3-a48e-3fb0-082c-3a0601aa2678',
  'e5f02166-36cb-12a8-a5ba-3a0601aa5aed',
  '42054107-17fb-e6e7-eb58-3a0601aa8dd3',
  '26069c6c-a5b8-a2ac-c94d-3a0601aab009',
  '001dfb24-1618-e975-6578-3a0601aac804',
];
