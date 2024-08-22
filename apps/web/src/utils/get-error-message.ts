import { AxiosError } from 'axios';

export const getErrorMessage = (e: AxiosError<any> | string): string => {
  if (typeof e === 'string') {
    return e;
  }
  return e.response?.data?.errorType
    ? `${e.response.data.errorType}: ${e.response.data.errorMessage}`
    : e.message;
};
