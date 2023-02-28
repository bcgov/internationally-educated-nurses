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
export interface ReportFourItem {
  status: string | STATUS;
  oldProcessApplicants: string;
  newProcessApplicants: string;
}
