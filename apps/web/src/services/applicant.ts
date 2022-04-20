import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import {
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
  IENApplicantAddStatusDTO,
  IENApplicantFilterDTO,
  ApplicantRO,
  ApplicantJobRO,
  ApplicantStatusAuditRO,
} from '@ien/common';

// get all applicants
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

// get applicant details
export const getApplicant = async (id: string): Promise<ApplicantRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: ApplicantRO }>(`/ien/${id}?relation=audit`);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};

// currently unused
export const updateApplicant = async (id: string, applicant: IENApplicantCreateUpdateDTO) => {
  return await axios.patch(`/ien/${id}`, applicant);
};

// Recruitment Tab - job records
// add a new job record
export const addJobRecord = async (
  id: string,
  record: IENApplicantJobCreateUpdateDTO,
): Promise<ApplicantJobRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.post<{ data: ApplicantJobRO }>(`/ien/${id}/job`, record);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};

// add a new milestone
export const addMilestone = async (
  id: string,
  milestone: IENApplicantAddStatusDTO,
): Promise<ApplicantStatusAuditRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.post<{ data: ApplicantStatusAuditRO }>(`/ien/${id}/status`, milestone);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};

// get job and milestone data
export const getJobAndMilestones = async (id: string): Promise<ApplicantJobRO[] | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: ApplicantJobRO[] }>(`/ien/${id}/jobs`);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};

// get single job and milestone data
export const getJobAndMilestone = async (
  applicantId: string,
  jobId: string,
): Promise<ApplicantJobRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: ApplicantJobRO }>(`/ien/${applicantId}/job/${jobId}`);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};
