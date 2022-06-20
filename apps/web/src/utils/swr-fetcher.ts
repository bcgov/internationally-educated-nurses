import axios, { AxiosError } from 'axios';

import { notifyError } from './notify-error';

export const fetcher = (url: string) =>
  axios
    .get(url)
    .then(res => res.data)
    .catch(error => notifyError(error as AxiosError));
