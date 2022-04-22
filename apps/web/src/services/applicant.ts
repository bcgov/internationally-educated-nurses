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
  JobQueryOptions,
  IENApplicantUpdateStatusDTO,
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

export const updateJobRecord = async (
  id: string,
  job_id: string,
  record: IENApplicantJobCreateUpdateDTO,
): Promise<ApplicantJobRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.put<{ data: ApplicantJobRO }>(`/ien/${id}/job/${job_id}`, record);

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

export const getJobAndMilestones = async (
  id: string,
  options: JobQueryOptions,
): Promise<[ApplicantJobRO[], number] | undefined> => {
  const { job_id, ha_pcn, job_title, skip, limit } = options;
  try {
    let path = `/ien/${id}/jobs?`;
    if (job_id) path += `job_id=${job_id}`;

    if (ha_pcn && ha_pcn.length) path += `&ha_pcn=${ha_pcn.join(',')}`;
    if (job_title && job_title.length) path += `&job_title=${job_title.join(',')}`;
    if (skip) path += `&skip=${skip}`;
    if (limit) path += `&limit=${limit}`;

    const {
      data: { data },
    } = await axios.get<{ data: [ApplicantJobRO[], number] }>(path);

    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};

export const updateMilestone = async (
  id: string,
  status_id: string,
  status: IENApplicantUpdateStatusDTO,
): Promise<ApplicantStatusAuditRO | undefined> => {
  try {
    const path = `/ien/${id}/status/${status_id}`;
    const {
      data: { data },
    } = await axios.patch<{ data: ApplicantStatusAuditRO }>(path, status);
    return data;
  } catch (error) {
    const e = error as AxiosError;
    toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
  }
};
