import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { IENApplicantCreateUpdateDTO, NursingEducationDTO } from '@ien/common';

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
