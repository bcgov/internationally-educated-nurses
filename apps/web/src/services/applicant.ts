import { ApplicantCreateDTO } from '@ien/common';
import axios from 'axios';

export const getApplicants = async () => {
  return await axios.get(`/ien`);
};

export const getApplicant = async (id: string) => {
  return await axios.get(`/ien/${id}`);
};

export const updateApplicant = async (id: string, applicant: ApplicantCreateDTO) => {
  return await axios.patch(`/ien/${id}`, applicant);
};
