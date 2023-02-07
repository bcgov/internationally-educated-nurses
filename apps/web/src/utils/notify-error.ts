import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from './get-error-message';

export const notifyError = (e: AxiosError | string) => {
  const message = getErrorMessage(e);
  if (message) toast.error(message);
};
