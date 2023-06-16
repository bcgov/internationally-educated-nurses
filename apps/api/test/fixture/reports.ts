import { IenType, STATUS } from '@ien/common';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export const validApplicantForReport = {
  first_name: 'Test',
  last_name: 'Report1',
  applicant_id: randomUUID(),
  email_address: 'test.report1@mailinator.com',
  phone_number: '77-555-1234',
  registration_date: '2022-06-19',
};

export const applicant = { id: validApplicantForReport.applicant_id };

export const withdrewReason = { id: 'a1e0e2c1-e272-468a-8f7a-28686b750cae' };

export const addMilestone = {
  status: STATUS.WITHDREW_FROM_PROGRAM,
  job_id: '08bb7e3f-3148-43d3-9740-6a255aa0d5ff',
  start_date: new Date().toISOString().slice(0, 10),
  notes: 'Test Note 1',
  reason: '',
  type: IenType.RN,
  effective_date: dayjs().add(10, 'days').format('YYYY-MM-DD'),
};
