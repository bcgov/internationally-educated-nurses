import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import {
  IENApplicantCreateUpdateDTO,
  NursingEducationDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
  STATUS,
  Authorities,
} from '@ien/common';
import { getRepository } from 'typeorm';
import { IENApplicantStatusAudit } from '../src/applicant/entity/ienapplicant-status-audit.entity';
import { IENApplicantStatus } from '../src/applicant/entity/ienapplicant-status.entity';
import { IENHaPcn } from '../src/applicant/entity/ienhapcn.entity';
import { ReportFourItem } from './fixture/reports';

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

export const getStatusId = async (status: STATUS): Promise<string> => {
  const result = await getRepository(IENApplicantStatus).findOne({ status });
  return result?.id || '';
};

export const getStatus = async (
  status: STATUS,
  start?: string,
): Promise<IENApplicantAddStatusDTO> => {
  return {
    status: await getStatusId(status),
    start_date: start || dayjs().format('YYYY-MM-DD'),
  };
};

export const clearMilestones = async () => {
  const repository = getRepository(IENApplicantStatusAudit);
  await repository.clear();
};

export const getHaId = async (ha: keyof typeof Authorities): Promise<string> => {
  const result = await getRepository(IENHaPcn).findOne({ abbreviation: ha });
  return result?.id || '';
};

/**
 *
 * @param date
 * @param days number of days to be added
 * @return date in the format of 'YYYY-MM-DD'
 */
export const addDays = (date: string, days: number) => {
  return dayjs(date).add(days, 'days').format('YYYY-MM-DD');
};

// Find the number of applicants for the given status
export const reportFourNumberOfApplicants = (
  body: ReportFourItem[],
  applicantStatus: string | STATUS,
) => {
  return body.find((e: { status: string }) => {
    return e.status === applicantStatus;
  })?.applicants;
};
