import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import {
  IENApplicantCreateUpdateDTO,
  NursingEducationDTO,
  IENApplicantJobCreateUpdateDTO,
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

interface JobOptions {
  ha_pcn: string;
  job_id: string;
  recruiter_name?: string;
}

interface MilestoneOptions {
  status: string;
  job_id: string;
  start_date?: string;
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

export const getEducation = (options?: EducationOptions): NursingEducationDTO => {
  const { country, year, name } = options || {};
  return {
    name: name || faker.helpers.arrayElement(EDUCATIONS),
    year: year || faker.date.past().getFullYear(),
    country: country || faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS)),
    num_years: faker.helpers.arrayElement([1, 2, 3, 4]),
  };
};

export const HEALTH_AUTHORITIES = [
  {
    id: 'F314A4D7-86AD-0696-26F5-3A05E5B6FB7F',
    name: 'Vancouver Coastal Health',
  },
  {
    id: '5C81ED72-6285-7F28-FAF0-3A05E5B8024F',
    name: 'Interior Health',
  },
  {
    id: '1ADC5904-17A8-B4CA-55C5-3A05E5B6797F',
    name: 'Vancouver Island Health',
  },
  {
    id: '28F4B8FD-588B-C170-3434-3A05E5B88823',
    name: 'Northern Health',
  },
  {
    id: '0388F125-E89F-2DF7-24A0-3A05E5C0956D',
    name: 'Provincial Health Services',
  },
  {
    id: '44B31F94-A91E-7DE3-9BF7-3A05E5C2A625',
    name: 'Providence Health Care',
  },
  {
    id: 'FEDB572A-C723-4DF7-C478-3A05E5C34A82',
    name: 'First Nations Health',
  },
  {
    id: '6AD69443-E3A8-3CBC-8CC9-3A05E5B771E4',
    name: 'Fraser Health',
  },
];

export const RECRUITMENT_STAGE_STATUSES = [
  { id: '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2', name: 'Job Offer Accepted' },
  { id: 'D875B680-F027-46B7-05A5-3A0601B3A0E1', name: 'Candidate Passed Reference Check' },
];

export const getJob = (options: JobOptions): IENApplicantJobCreateUpdateDTO => {
  const { ha_pcn, recruiter_name, job_id } = options || {};
  return {
    ha_pcn: ha_pcn,
    recruiter_name: recruiter_name || faker.name.fullName(),
    job_id: job_id + faker.animal.bear() + faker.animal.insect(),
  };
};

export const getMilestone = (options: MilestoneOptions) => {
  const { status, job_id, start_date } = options || {};
  return {
    status: status,
    job_id: job_id,
    start_date: start_date || new Date().toISOString().slice(0, 10),
  };
};
