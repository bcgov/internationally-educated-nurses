import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import {
  IENApplicantCreateUpdateDTO,
  NursingEducationDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
  STATUS,
} from '@ien/common';

interface EducationOptions {
  count?: number;
  country?: keyof typeof COUNTRY_OF_EDUCATIONS;
  name?: typeof EDUCATIONS[number];
  year?: number;
}

interface ApplicantOptions {
  between?: [string, string];
}

export const getApplicant = (options?: ApplicantOptions): IENApplicantCreateUpdateDTO => {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const registration = options?.between
    ? faker.date.between(...options.between)
    : faker.date.past();
  return {
    applicant_id: faker.datatype.uuid(),
    first_name,
    last_name,
    email_address: faker.internet.email(first_name, last_name),
    phone_number: faker.phone.number(),
    registration_date: dayjs(registration).format('YYYY-MM-DD'),
    nursing_educations: [],
    country_of_citizenship: [faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS))],
    country_of_residence: faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS)),
    pr_status: '',
    is_open: true,
  };
};

export const EDUCATIONS = [
  'Diploma/Certificate of Nursing',
  'Associate Degree of Nursing',
  'Bachelor of Nursing or Bachelor of Science in Nursing',
  'Master of Nursing',
  'Master of Nursing - Nurse Practitioner',
  'PhD',
  'Combined Diploma/Degree in Midwifery & Nursing',
] as const;

export const COUNTRY_OF_EDUCATIONS = {
  us: 'us',
  uk: 'uk',
  ie: 'ireland',
  in: 'india',
  au: 'australia',
  ph: 'philippines',
  ng: 'nigeria',
  jm: 'jamaica',
  ke: 'kenya',
  ca: 'canada',
  'n/a': 'n/a',
};

export const RECRUITMENT_STAGE_STATUSES = {
  [STATUS.JOB_OFFER_ACCEPTED]: '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2',
  [STATUS.REFERENCE_CHECK_PASSED]: 'D875B680-F027-46B7-05A5-3A0601B3A0E1',
  [STATUS.INTERVIEW_PASSED]: 'BD91E596-8F9A-0C98-8B9C-3A0601B2A18B',
};

export const IMMIGRATION_STAGE_STATUSES = {
  [STATUS.SENT_FIRST_STEPS_DOCUMENT]: '4d435c42-f588-4174-bb1e-1fe086b23214',
  [STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER]: 'caa18ecd-fea5-459e-af27-bca15ac26133',
};

export const getEducation = (options?: EducationOptions): NursingEducationDTO => {
  const { country, year, name } = options || {};
  return {
    name: name || faker.helpers.arrayElement(EDUCATIONS),
    year: year || faker.date.past().getFullYear(),
    country: country || faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS)),
    num_years: faker.helpers.arrayElement([1, 2, 3, 4]),
  };
};

export const getJob = (options: IENApplicantJobCreateUpdateDTO): IENApplicantJobCreateUpdateDTO => {
  const { ha_pcn, recruiter_name, job_id } = options || {};
  return {
    ha_pcn: ha_pcn,
    recruiter_name: recruiter_name || faker.name.fullName(),
    job_id:
      job_id + faker.animal.bear() + faker.animal.insect() ||
      faker.animal.cow() + faker.animal.rodent(),
  };
};

export const getMilestone = (options: IENApplicantAddStatusDTO): IENApplicantAddStatusDTO => {
  const { status, job_id, start_date } = options || {};
  return {
    status: status,
    job_id: job_id,
    start_date: start_date || new Date().toISOString().slice(0, 10),
  };
};

export const getIndexOfStatus = (arr: unknown[], compareTo: string) => {
  return arr.findIndex((v: any) => v.status === compareTo);
};
