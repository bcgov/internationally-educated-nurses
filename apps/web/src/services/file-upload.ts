import { FormDTO } from '@ien/common';
import axios from 'axios';

export const uploadForm = async (form: FormDTO) => {
  return await axios.post(`/form`, form);
};
