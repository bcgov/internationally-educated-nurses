import axios from 'axios';

import {
  IENApplicantCreateDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
} from '@ien/common';

// applicant specific
export const getApplicants = async (param?: string, value?: any) => {
  const params = new URLSearchParams([[param, value]]);

  return await axios.get(`/ien`, { params });
};

export const getApplicant = async (id: string) => {
  return await axios.get(`/ien/${id}?relation=audit`);
};

export const updateApplicant = async (id: string, applicant: IENApplicantCreateDTO) => {
  return await axios.patch(`/ien/${id}`, applicant);
};

// Recruitment Tab - job records
export const addJobRecord = async (id: string, record: IENApplicantJobCreateUpdateDTO) => {
  return await axios.post(`/ien/${id}/job`, record);
};

export const addMilestone = async (id: string, milestone: IENApplicantAddStatusDTO) => {
  return await axios.post(`/ien/${id}/status`, milestone);
};

export const getJobAndMilestones = async (id: string) => {
  return await axios.get(`/ien/${id}/jobs`);
};
