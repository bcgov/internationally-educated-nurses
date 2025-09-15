import axios, { AxiosError } from 'axios';
import useSWR from 'swr';

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
import { convertToParams, fetcher, notifyError } from '../utils';

// get all applicants
export const getApplicants = async (filter: IENApplicantFilterDTO = {}) => {
  const response = await axios.get<{ data: [ApplicantRO[], number] }>(
    `/ien?${convertToParams(filter)}`,
  );
  if (Array.isArray(response?.data?.data)) {
    const [data, count] = response.data.data;
    return { data, count };
  }
  return { data: [], count: 0 };
};

// get applicant details
export const getApplicant = async (id: string): Promise<ApplicantRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: ApplicantRO }>(`/ien/${id}?relation=audit`);

    return data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

// add new applicant
export const addApplicant = async (applicant: IENApplicantCreateUpdateDTO) => {
  const {
    data: { data },
  } = await axios.post<{ data: ApplicantRO }>(`/ien`, applicant);

  return data;
};

export const deleteApplicantStatus = async (
  user_id?: string | null,
  status_id?: string,
): Promise<void> => {
  if (!user_id) return;
  try {
    await axios.delete(`/ien/${user_id}/status/${status_id}`);
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

/**
 * Delete applicant (scramble PII)
 * @param id
 */
export const deleteApplicant = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/ien/${id}`);
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

// currently unused
export const updateApplicant = async (id: string, applicant: IENApplicantCreateUpdateDTO) => {
  return axios.patch(`/ien/${id}`, applicant);
};

export const updateApplicantActiveFlag = async (id: string, activeFlag: boolean) => {
  try {
    const {
      data: { data },
    } = await axios.patch(`/ien/${id}/active`, { activeFlag });
    return data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const getJobRecord = async (job_id: number): Promise<ApplicantJobRO | undefined> => {
  try {
    const {
      data: { data },
    } = await axios.get<{ data: ApplicantJobRO }>(`/ien/job/${job_id}`);
    return data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
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
  } catch (e) {
    notifyError(e as AxiosError);
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
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const deleteJobRecord = async (user_id?: string | null, job_id?: string): Promise<void> => {
  if (!user_id) return;
  try {
    await axios.delete(`/ien/${user_id}/job/${job_id}`);
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

// add a new milestone
export const addMilestone = async (
  id: string,
  milestone: IENApplicantAddStatusDTO,
): Promise<ApplicantStatusAuditRO | undefined> => {
  try {
    const response = await axios.post<{ data: ApplicantStatusAuditRO }>(
      `/ien/${id}/status`,
      milestone,
    );
    if (response?.data?.data) {
      return response.data.data;
    }
    return;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const getJobAndMilestones = async (
  id: string,
  options: JobQueryOptions,
): Promise<[ApplicantJobRO[], number] | undefined> => {
  try {
    const params = new URLSearchParams();

    Object.entries(options).forEach(parameter => {
      if (Array.isArray(parameter[1])) {
        if (parameter[0] && parameter[1].length > 0) {
          params.append(parameter[0], parameter[1].toString());
        }
      } else if (parameter[0] && parameter[1]) {
        params.append(parameter[0], parameter[1].toString());
      }
    });

    const {
      data: { data },
    } = await axios.get<{ data: [ApplicantJobRO[], number] }>(
      `/ien/${id}/jobs?${params.toString()}`,
    );

    return data;
  } catch (e) {
    notifyError(e as AxiosError);
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
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

// get last applicant sync time from ATS
export const useGetLastSyncTime = () => {
  const { data: sync } = useSWR('external-api/sync-applicants-audit', fetcher);

  return sync?.data;
};

export const assignApplicant = async (applicantId: string): Promise<boolean> => {
  try {
    await axios.post(`/ien/${applicantId}/assign`);
    return true;
  } catch (e) {
    notifyError(e as AxiosError);
    return false;
  }
};
