import axios, { AxiosError } from 'axios';
import { convertToParams, Period, PeriodFilter } from '@ien/common';
import { notifyError } from '../utils/notify-error';

export const getPeriods = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/registered?${convertToParams(filter)}`;
    const { data } = await axios.get<{ data: Period[] }>(url);
    return data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};
