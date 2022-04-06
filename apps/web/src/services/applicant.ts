import axios from 'axios';

import {
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
  IENApplicantFilterDTO,
  ApplicantRO,
} from '@ien/common';

export const getApplicants = async (filter: IENApplicantFilterDTO = {}) => {
  const query = Object.entries(filter)
    .map(entry => (entry[1] ? entry.join('=') : null))
    .filter(v => v)
    .join('&');
  const response = await axios.get<{ data: [ApplicantRO[], number] }>(
    query ? `/ien?${query}` : '/ien',
  );
  const {
    data: [data, count],
  } = response.data;
  return { data, count };
};

export const getApplicant = async (id: string) => {
  return await axios.get(`/ien/${id}?relation=audit`);
};

export const updateApplicant = async (id: string, applicant: IENApplicantCreateUpdateDTO) => {
  return await axios.patch(`/ien/${id}`, applicant);
};

// Recruitment Tab - job records
export const addJobRecord = async (id: string, record: IENApplicantJobCreateUpdateDTO) => {
  return await axios.post(`/ien/${id}/job`, record);
};

export const addMilestone = async (id: string, milestone: IENApplicantAddStatusDTO) => {
  return await axios.post(`/ien/${id}/status`, milestone);
};

// @todo fix any
export const getJobAndMilestones = async (id: string): Promise<any> => {
  return await axios.get(`/ien/${id}/jobs`);
};
