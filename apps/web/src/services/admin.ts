import axios from 'axios';
import { UserGuide } from '@ien/common';

export const downloadUserGuide = async (name: string, version?: string) => {
  const query = version ? new URLSearchParams({ version }).toString() : '';

  const response = await axios.get(`/admin/user-guides/${name}?${query}`, { responseType: 'blob' });

  return window.URL.createObjectURL(response.data);
};

export const uploadUserGuide = async (payload: FormData) => {
  const { data } = await axios.post(`/admin/user-guides`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
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
