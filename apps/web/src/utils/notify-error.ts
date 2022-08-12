import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const notifyError = (e: AxiosError | string) => {
  const message =
    typeof e === 'string' ? e : `${e.response?.data.errorType}: ${e.response?.data.errorMessage}`;
  toast.error(message);
};
