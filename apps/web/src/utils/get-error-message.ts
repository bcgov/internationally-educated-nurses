import { AxiosError } from 'axios';

export const getErrorMessage = (e: AxiosError | string): string => {
  if (typeof e === 'string') {
    return e;
  }
  return e.isAxiosError ? `${e.response}` : e.message;
};
