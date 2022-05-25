import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const notifyError = (e: AxiosError) => {
  toast.error(`${e.response?.data.errorType}: ${e.response?.data.errorMessage}`);
};
