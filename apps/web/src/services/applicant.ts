import axios from 'axios';

import {
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
} from '@ien/common';

// applicant specific
export const getApplicants = async () => {
  return await axios.get(`/ien`);
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
