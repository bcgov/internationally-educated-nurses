/* eslint-disable no-console */
import { faker } from '@faker-js/faker';
import axios from 'axios';
import dayjs from 'dayjs';
import { config } from 'dotenv';
import _ from 'lodash';
import {
  ApplicantJobRO,
  ApplicantRO,
  BCCNM_NCAS_STAGE,
  IENApplicantAddStatusDTO,
  IENApplicantJobCreateUpdateDTO,
  IENHaPcnRO,
  IMMIGRATION_STAGE,
  LIC_REG_STAGE,
  NNAS_STAGE,
  RECRUITMENT_STAGE,
  STATUS,
} from '@ien/common';

config({ path: '../../.env' });
let start = new Date();

const AUTH_URL = 'https://keycloak.freshworks.club/auth';

const getToken = async (): Promise<void> => {
  const url = `${AUTH_URL}/realms/ien/protocol/openid-connect/token`;
  const resp = await axios.post(
    url,
    {
      grant_type: 'password',
      client_id: 'IEN',
      username: process.env.E2E_TEST_USERNAME,
      password: process.env.E2E_TEST_PASSWORD,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
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
  const duration = _.random(1, 10);
  return dayjs(start).add(duration, 'days').format('YYYY-MM-DD');
};

const addMilestone = async (
  applicant: ApplicantRO,
  statusId: string,
  previous: any,
  job?: ApplicantJobRO,
) => {
  const milestone: IENApplicantAddStatusDTO = {
    status: statusId,
    start_date: getNewStartDate(
      previous?.start_date || applicant.registration_date || new Date('2021-03-15'),
    ),
  };
  if (job) milestone.job_id = job.id;
  await axios.post(`/ien/${applicant.id}/status`, milestone);
  return milestone;
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
  const stages = [
    LIC_REG_STAGE,
    NNAS_STAGE,
    BCCNM_NCAS_STAGE,
    RECRUITMENT_STAGE,
    IMMIGRATION_STAGE,
  ];

  if (applicant.jobs?.length) {
    console.log(`skip applicant ${applicant.id} with a job`);
    return;
  }

  const job = await createJob(applicant);

  for (let s = 0; s < stages.length; s++) {
    for (let i = 0; i < stages[s].length; i++) {
      const status = stages[s][i];
      const milestone = applicant.applicant_status_audit?.find(s => s.status.status === status);
      if (milestone) {
        previous = { start_date: milestone.start_date, status: milestone.status.id };
        continue;
      }
      previous = await addMilestone(
        applicant,
        statuses[status],
        previous,
        stages[s] === RECRUITMENT_STAGE ? job : undefined,
      );

      if (status === STATUS.JOB_OFFER_ACCEPTED) break;
    }
  }
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

axios.defaults.baseURL = 'http://localhost:4000/api/v1';

setToken()
  .then(async () => {
    const [applicants, count] = await getApplicants();
    const statuses = await getMilestones();
    for (let i = 0; i < count; i++) {
      await checkToken(start);

      const applicant = applicants[i];
      if (dayjs(applicant.registration_date).isAfter('2022-06-01')) {
        console.log(`skip applicant registered at ${applicant.registration_date}`);
        continue;
      }

      await generateMilestones(applicant.id, statuses);
      console.log(`${i}/${count} applicant processed <- ${applicant.id}`);
    }
  })
  .catch(e => {
    console.log(e);
  })
  .finally(() => {
    console.log('generated milestones');
  });
