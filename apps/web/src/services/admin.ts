import axios from 'axios';

export const downloadGuide = async (name: string) => {
  const response = await axios.get(`/admin/user-guides/${name}`, { responseType: 'blob' });
  return window.URL.createObjectURL(response.data);
};

export const uploadUserGuide = async (payload: FormData) => {
  const { data } = await axios.post(`/admin/user-guides`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};
