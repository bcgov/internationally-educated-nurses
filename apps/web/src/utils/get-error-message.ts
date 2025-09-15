import { AxiosError } from 'axios';

export const getErrorMessage = (e: AxiosError<unknown> | string): string => {
  if (typeof e === 'string') {
    return e;
  }
  const data = e.response?.data as { errorType?: string; errorMessage?: string } | undefined;
  return data?.errorType ? `${data.errorType}: ${data.errorMessage}` : e.message;
};
