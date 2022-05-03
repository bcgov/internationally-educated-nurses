import { FormDTO } from '@ien/common';
import axios from 'axios';

export const uploadForm = async (form: FormDTO) => {
  return axios.post(`/form`, form);
};
