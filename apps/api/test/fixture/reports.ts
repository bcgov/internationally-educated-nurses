import { IENApplicantJobCreateUpdateDTO } from '@ien/common';
import { STATUS } from '@ien/common/src/enum';
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

export const statusNames = [
  'BCCNM Full Licence LPN',
  'BCCNM Full Licence RN',
  'BCCNM Provisional Licence LPN',
  'BCCNM Provisional Licence RN',
];
export const jobInput: IENApplicantJobCreateUpdateDTO = {
  ha_pcn: '6ad69443-e3a8-3cbc-8cc9-3a05e5b771e4',
  job_id: '148593',
  recruiter_name: 'Test 4',
};

export type ReportTestStatus = LICENSE_STATUS | BCCNM_STATUS;

export enum LICENSE_STATUS {
  APPLIED_TO_NNAS = 'Applied to NNAS',
  APPLIED_TO_BCCNM = 'Applied to BCCNM',
  COMPLETED_LANGUAGE_REQUIREMENT = 'Completed English Language Requirement',
  REFERRED_TO_NCAS = 'Referred to NCAS',
  COMPLETED_NCAS = 'Completed NCAS',
  COMPLETED_ADDITIONAL_EDUCATION = 'Completed Additional Education',
  NCLEX_WRITTEN = 'NCLEX – Written',
  NCLEX_PASSED = 'NCLEX – Passed',
  REX_PN_WRITTEN = 'REx-PN - Written',
  REX_PN_PASSED = 'REx-PN - Passed',
  BCCNM_FULL_LICENCE_LPN = 'BCCNM Full Licence LPN',
  BCCNM_FULL_LICENSE_RN = 'BCCNM Full Licence RN',
  BCCNM_PROVISIONAL_LICENSE_LPN = 'BCCNM Provisional Licence LPN',
  BCCNM_PROVISIONAL_LICENSE_RN = 'BCCNM Provisional Licence RN',
  REFERRED_TO_REGISTRATION_EXAM = 'Referred to Registration Exam',
  REGISTERED_AS_AN_HCA = 'Registered as an HCA',
  REGISTRATION_JOURNEY_COMPLETED = 'Registration Journey Complete',
  WITHDREW_FROM_PROGRAM = 'Withdrew from IEN program',
  READY_FOR_JOB_SEARCH = 'Applicant Ready for Job Search',
  REFERRED_TO_FNHA = 'Applicant Referred to FNHA',
  REFERRED_TO_FHA = 'Applicant Referred to FHA',
  REFERRED_TO_IHA = 'Applicant Referred to IHA',
  REFERRED_TO_NHA = 'Applicant Referred to NHA',
  REFERRED_TO_PHC = 'Applicant Referred to PHC',
  REFERRED_TO_PHSA = 'Applicant Referred to PHSA',
  REFERRED_TO_VCHA = 'Applicant Referred to VCHA',
  REFERRED_TO_VIHA = 'Applicant Referred to VIHA',
}

export enum BCCNM_STATUS {
  BCCNM_FULL_LICENCE_LPN = 'BCCNM Full Licence LPN',
  BCCNM_FULL_LICENSE_RN = 'BCCNM Full Licence RN',
  BCCNM_PROVISIONAL_LICENSE_LPN = 'BCCNM Provisional Licence LPN',
  BCCNM_PROVISIONAL_LICENSE_RN = 'BCCNM Provisional Licence RN',
}

export interface Report4Item {
  status: string | STATUS;
  applicants: string;
}
