import { ApplicantCreateDTO } from '@ien/common';
import axios from 'axios';

export const getApplicants = async () => {
  return await axios.get(`/applicant`);
};

export const getApplicant = async (id: string) => {
  return await axios.get(`/applicant/${id}`);
};

export const addApplicant = async (applicant: ApplicantCreateDTO) => {
  return await axios.post(`/applicant`, applicant);
};
