import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import _ from 'lodash';
import { getRepository } from 'typeorm';

import {
  Authorities,
  IENApplicantAddStatusDTO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  IenType,
  NursingEducationDTO,
  STATUS,
} from '@ien/common';
import { IENApplicantStatusAudit } from '../src/applicant/entity/ienapplicant-status-audit.entity';
import { IENHaPcn } from '../src/applicant/entity/ienhapcn.entity';
import { ReportFourItem } from './report-types';
import { IENApplicantStatus } from '../src/applicant/entity/ienapplicant-status.entity';

interface EducationOptions {
  count?: number;
  country?: keyof typeof COUNTRY_OF_EDUCATIONS;
  name?: typeof EDUCATIONS[number];
  year?: number;
}

export interface ApplicantOptions {
  between?: [string, string];
}

export const getApplicant = (options?: ApplicantOptions): IENApplicantCreateUpdateDTO => {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const registration = options?.between
    ? faker.date.between(...options.between)
    : faker.date.past();
  return {
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
    ats1_id: faker.random.numeric(6),
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
  'Education',
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
  return {
    ...options,
    job_id:
      options.job_id + faker.animal.bear() + faker.animal.insect() ||
      faker.animal.cow() + faker.animal.rodent(),
  };
};

export const getMilestone = (options: IENApplicantAddStatusDTO): IENApplicantAddStatusDTO => {
  const { status, job_id, start_date } = options || {};
  const milestone: IENApplicantAddStatusDTO = {
    status,
    job_id,
    start_date: start_date || dayjs().format('YYYY-MM-DD'),
  };
  if (status === STATUS.JOB_OFFER_ACCEPTED) {
    milestone.type = IenType.RN;
    milestone.effective_date = dayjs(milestone.start_date).add(10, 'days').format('YYYY-MM-DD');
  }
  return milestone;
};

export const getIndexOfStatus = (arr: { status: string | STATUS }[], compareTo: string) => {
  return arr.findIndex(v => v.status === compareTo);
};

export const getStatus = async (
  status: STATUS,
  start?: string,
): Promise<IENApplicantAddStatusDTO> => {
  return {
    status,
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

export const getStatusId = async (status: STATUS) => {
  const result = await getRepository(IENApplicantStatus).findOne({ status });
  return result?.id;
};

/**
 *
 * @param date
 * @param days number of days to be added
 * @return date in the format of 'YYYY-MM-DD'
 */
export const addDays = (date: string | Date, days: number) => {
  return dayjs(date).add(days, 'days').format('YYYY-MM-DD');
};

/**
 * Find the number of applicants for report 4 with the given status
 * @param body
 * @param applicantStatus number of days to be added
 * @param isNewProcess look for new process if true, old otherwise
 * @return number of applicants
 */
export const reportFourNumberOfApplicants = (
  body: ReportFourItem[],
  applicantStatus: string | STATUS,
  isNewProcess: boolean,
) => {
  const process = isNewProcess ? 'newProcessApplicants' : 'oldProcessApplicants';
  return (
    body.find(e => {
      return e.status === applicantStatus;
    })?.[process] || '0'
  );
};

/**
 * Gives same results as adding all milestones to different applicants
 * @param body report 4 initial values
 * @param isNewProcess look for new process if true, old otherwise
 * @return expected result for adding every licensing milestone
 */
export const reportFourExpectedResult = (body: ReportFourItem[], isNewProcess: boolean) => {
  const process = isNewProcess ? 'newProcessApplicants' : 'oldProcessApplicants';

  return body.map(item => {
    const stat = item.status;
    let result = parseInt(item[process]) + 1;
    // Accounts for other two BCCNM Licenses
    if (stat === 'Granted provisional licensure' || stat === 'Granted full licensure') {
      result++;
    }
    // NCAS count increases with COMPLETED_CBA and COMPLETED_SLA
    // NNAS count increases with RECEIVED_NNAS_REPORT and SUBMITTED_DOCUMENTS
    else if (stat === STATUS.APPLIED_TO_NCAS || stat === STATUS.APPLIED_TO_NNAS) {
      result += 2;
    }
    // Referred to Additional Education makes this report count increase
    else if (stat === STATUS.COMPLETED_ADDITIONAL_EDUCATION) {
      result++;
    }
    return {
      ...item,
      [process]: result.toString(),
    };
  });
};

export const generateDurations = (
  numberOfApplicants: number,
  milestones: STATUS[],
  max = 10,
): Record<STATUS, number[]> => {
  const excludedMilestones = [
    STATUS.REFERRED_TO_FNHA,
    STATUS.REFERRED_TO_FHA,
    STATUS.REFERRED_TO_IHA,
    STATUS.REFERRED_TO_NHA,
    STATUS.REFERRED_TO_PHC,
    STATUS.REFERRED_TO_PHSA,
    STATUS.REFERRED_TO_VCHA,
    STATUS.REFERRED_TO_VIHA,
    STATUS.PRE_SCREEN_NOT_PASSED,
    STATUS.INTERVIEW_NOT_PASSED,
    STATUS.REFERENCE_CHECK_NOT_PASSED,
    STATUS.WITHDREW_FROM_PROGRAM,
    STATUS.WITHDREW_FROM_COMPETITION,
    STATUS.HA_NOT_INTERESTED,
    STATUS.NO_POSITION_AVAILABLE,
    STATUS.JOB_COMPETITION_CANCELLED,
    STATUS.JOB_OFFER_NOT_ACCEPTED,
    STATUS.WITHDREW_FROM_COMPETITION,
    STATUS.RECEIVED_WORK_PERMIT,
    STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER,
    STATUS.SUBMITTED_PR_APPLICATION,
  ];
  return milestones
    .filter(m => !excludedMilestones.includes(m))
    .reduce((a, c) => {
      return {
        ...a,
        [c]: Array.from({ length: numberOfApplicants }, () => _.random(1, max)),
      };
    }, {} as Record<STATUS, number[]>);
};
