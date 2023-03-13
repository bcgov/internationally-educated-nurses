/* eslint-disable no-console */
import { faker } from '@faker-js/faker';
import axios from 'axios';
import dayjs from 'dayjs';
import { config } from 'dotenv';
import _ from 'lodash';
import {
  ApplicantJobRO,
  ApplicantRO,
  IENApplicantAddStatusDTO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  IENHaPcnRO,
  IMMIGRATION_STAGE,
  LIC_REG_STAGE,
  RECRUITMENT_STAGE,
  STATUS,
} from '@ien/common';

config({ path: '../../.env' });

const MIN_DURATION = 5;
const MAX_DURATION = 20;
const APPLICANT_COUNT = 4000;
let start = new Date();

const getToken = async (): Promise<void> => {
  const url = `${process.env.AUTH_URL}/realms/${process.env.AUTH_REALM}/protocol/openid-connect/token`;
  const data = new URLSearchParams({
    grant_type: 'password',
    client_id: process.env.AUTH_CLIENTID ?? '',
    username: process.env.E2E_TEST_USERNAME ?? '',
    password: process.env.E2E_TEST_PASSWORD ?? '',
  }).toString();
  const resp = await axios.post(url, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return resp.data.access_token;
};

const getApplicants = async () => {
  const resp = await axios.get('/ien');
  return resp.data.data;
};

const getApplicant = async (id: string): Promise<ApplicantRO> => {
  const resp = await axios.get(`/ien/${id}?relation=audit`);
  return resp?.data?.data;
};

const getMilestones = async () => {
  const resp = await axios.get('/ienmaster/status');
  return _.chain(resp?.data?.data).keyBy('status').mapValues('id').value();
};

const getNewStartDate = (start: Date) => {
  const duration = _.random(MIN_DURATION, MAX_DURATION);
  return dayjs(start).add(duration, 'days').format('YYYY-MM-DD');
};

const addMilestone = async (
  applicant: ApplicantRO,
  statusId: string,
  previous: any,
  job?: ApplicantJobRO,
) => {
  const start_date = getNewStartDate(
    previous?.start_date || applicant.registration_date || new Date('2021-03-15'),
  );

  // do not add future milestones.
  if (dayjs().isBefore(start_date)) return null;

  const milestone: IENApplicantAddStatusDTO = {
    status: statusId,
    start_date,
  };
  if (job) milestone.job_id = job.id;
  try {
    await axios.post(`/ien/${applicant.id}/status`, milestone);
    return milestone;
  } catch (e) {
    return null;
  }
};

const getAuthorities = async (): Promise<IENHaPcnRO[]> => {
  const resp = await axios.get('/ienmaster/ha-pcn');
  return resp?.data?.data;
};

const createJob = async (applicant: any): Promise<ApplicantJobRO> => {
  const authorities = await getAuthorities();
  const ha = authorities[_.random(0, authorities.length - 1)];
  const job: IENApplicantJobCreateUpdateDTO = {
    ha_pcn: ha.id,
    recruiter_name: faker.name.fullName(),
    job_post_date: dayjs(applicant.registration_date).add(2, 'months').format('YYYY-MM-DD'),
  };
  const resp = await axios.post(`/ien/${applicant.id}/job`, job);
  return resp?.data?.data;
};

const generateMilestones = async (id: string, statuses: Record<string, string>) => {
  const applicant = await getApplicant(id);
  let previous = undefined;
  const stages = [LIC_REG_STAGE, RECRUITMENT_STAGE, IMMIGRATION_STAGE];

  if (applicant.jobs?.length) {
    console.log(`skip applicant ${applicant.id} with a job`);
    return 0;
  }

  // limit number of milestones to distribute applicants over different stages evenly,
  const maxNumOfMilestones = _.random(1, _.sum(stages.map(s => s.length)));
  let count = 0;

  for (let sIndex = 0; sIndex < stages.length; sIndex++) {
    let job: ApplicantJobRO | null = null;
    if (stages[sIndex][0] === STATUS.REFERRAL_ACKNOWLEDGED) {
      job = await createJob(applicant);
    }
    // randomly skip a milestone
    for (let mIndex = _.random(1, 2); mIndex < stages[sIndex].length; mIndex += _.random(1, 2)) {
      if (count >= maxNumOfMilestones) return count;

      const status = stages[sIndex][mIndex];
      const milestone = applicant.applicant_status_audit?.find(s => s.status.status === status);
      if (milestone) {
        previous = { start_date: milestone.start_date, status: milestone.status.id };
        continue;
      }
      previous = await addMilestone(
        applicant,
        statuses[status],
        previous,
        stages[sIndex] === RECRUITMENT_STAGE && job ? job : undefined,
      );

      if (!previous) {
        return count;
      }
      count += 1;

      // do not add other later recruitment milestones
      if (status === STATUS.JOB_OFFER_ACCEPTED || status === STATUS.JOB_OFFER_NOT_ACCEPTED) break;
    }
  }
  return count;
};

const setToken = async () => {
  const token = await getToken();
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  start = new Date();
  console.log('token updated');
};

const checkToken = async (start: Date) => {
  if (dayjs().diff(start, 'minutes') > 3) {
    await setToken();
  }
};

const COUNTRY_OF_EDUCATIONS = {
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

const getNewApplicant = (from: string, to: string): IENApplicantCreateUpdateDTO => {
  const first_name = faker.name.firstName();
  const last_name = faker.name.lastName();
  const registration = faker.date.between(from, to);
  return {
    ats1_id: faker.datatype.uuid(),
    first_name,
    last_name,
    email_address: faker.internet.email(first_name, last_name),
    phone_number: faker.phone.number('###-###-####'),
    registration_date: dayjs(registration).format('YYYY-MM-DD'),
    nursing_educations: [],
    country_of_citizenship: [faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS))],
    country_of_residence: faker.helpers.arrayElement(Object.keys(COUNTRY_OF_EDUCATIONS)),
    pr_status: 'No status',
    is_open: true,
  };
};

const addApplicant = async (from: string, to: string): Promise<ApplicantRO> => {
  const applicant = getNewApplicant(from, to);
  const { data } = await axios.post<{ data: ApplicantRO }>(`/ien`, applicant);
  return data?.data;
};

axios.defaults.baseURL = 'http://localhost:4000/api/v1';

setToken()
  .then(async () => {
    const [applicants, initialCount] = await getApplicants();

    console.log(`${initialCount} applicants found`);

    while (applicants.length < APPLICANT_COUNT) {
      const applicant = await addApplicant('2021-01-01', dayjs().format('YYYY-MM-DD'));
      applicants.push(applicant);
    }
    const count = applicants.length;

    console.log(`${count - initialCount} applicants added`);

    const applicantsWithoutMilestones = applicants.filter((a: any) => !a.status);

    console.log(`${applicantsWithoutMilestones.length} applicants have no milestone.`);

    const statuses = await getMilestones();
    for (let i = 0; i < applicantsWithoutMilestones.length; i++) {
      await checkToken(start);

      const applicant = applicantsWithoutMilestones[i];

      const numOfMilestones = await generateMilestones(applicant.id, statuses);
      console.log(`${i}/${count} applicant: ${numOfMilestones} milestones <- ${applicant.id}`);
    }
  })
  .catch(e => {
    console.log(e);
  })
  .finally(() => {
    console.log('generated milestones');
  });
