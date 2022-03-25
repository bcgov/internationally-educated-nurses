import { IENApplicantCreateDTO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import axios from 'axios';

export const getApplicants = async () => {
  return await axios.get(`/ien`);
};

export const getApplicant = async (id: string) => {
  return await axios.get(`/ien/${id}?relation=audit`);
};

export const updateApplicant = async (id: string, applicant: IENApplicantCreateDTO) => {
  return await axios.patch(`/ien/${id}`, applicant);
};

export const addJobRecord = async (id: string, record: IENApplicantJobCreateUpdateDTO) => {
  return await axios.post(`/ien/${id}/job`, record);
};
