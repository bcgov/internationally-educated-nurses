import axios from 'axios';
import { BccnmNcasValidation, UserGuide } from '@ien/common';

export const getSignedUrlOfUserGuide = async (name: string, version?: string) => {
  const query = version ? new URLSearchParams({ version }).toString() : '';
  const { data } = await axios.get<{ data: string }>(`/admin/user-guides/${name}?${query}`);
  return data.data;
};

export const uploadUserGuide = async (payload: FormData) => {
  const { data } = await axios.post<{ data: UserGuide }>(`/admin/user-guides`, payload);
  return data.data;
};

export const getUserGuideVersions = async (name: string): Promise<UserGuide[]> => {
  const { data } = await axios.get<{ data: UserGuide[] }>(`/admin/user-guides/${name}/versions`);
  return data.data;
};

export const deleteUserGuide = async (name: string, version?: string) => {
  const query = version ? new URLSearchParams({ version }).toString() : '';
  await axios.delete(`/admin/user-guides/${name}?${query}`);
};

export const restoreUserGuide = async (name: string, version: string) => {
  const query = new URLSearchParams({ version }).toString();
  await axios.patch(`/admin/user-guides/${name}?${query}`);
};

export const validateBccnmNcasUpdates = async (payload: FormData) => {
  const { data } = await axios.post<{ data: BccnmNcasValidation[] }>(
    `/admin/validate-bccnm-ncas-updates`,
    payload,
  );
  return data.data;
};

export const applyBccnmNcasUpdates = async (data: BccnmNcasValidation[]) => {
  await axios.post(`/admin/apply-bccnm-ncas-updates`, { data });
};
