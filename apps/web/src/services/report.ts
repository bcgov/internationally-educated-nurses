import axios, { AxiosError } from 'axios';
import { convertToParams, Period, PeriodFilter } from '@ien/common';
import { notifyError } from '../utils/notify-error';
import dayjs from 'dayjs';
import { utils, WorkBook, WorkSheet } from 'xlsx';

export const getPeriods = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/registered?${convertToParams(filter)}`;
    const { data } = await axios.get<{ data: Period[] }>(url);
    return data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

interface SheetData {
  name: string;
  data: string[][];
  colWidths?: { wch: number }[];
}

export const getTimeRange = (period: Period): string => {
  const from =
    dayjs(period.from).year() === dayjs(period.to).year()
      ? dayjs(period.from).format('MMM DD')
      : dayjs(period.from).format('MMM DD, YYYY');

  return `${from} - ${dayjs(period.to).format('MMM DD, YYYY')}`;
};

const getRegApplicantsReportData = (period: Period, periods: Period[]): SheetData => {
  const data = [
    [`${dayjs(periods[0].from).format('MMM DD, YYYY')} to Present`, 'Total Applicants'],
  ];

  data.push(
    ...periods
      .filter(p => p.period <= period.period)
      .map(p => {
        return [`Period ${p.period}: ${getTimeRange(p)}`, `${p.applicants}`];
      }),
  );

  const colWidths = [{ wch: 40 }, { wch: 20 }];

  return { name: 'Report 1', data, colWidths };
};

const getReportSheet1 = (period: Period, periods: Period[]): [string, WorkSheet] => {
  const { name, data, colWidths } = getRegApplicantsReportData(period, periods);
  const sheet = utils.aoa_to_sheet(data);
  if (colWidths) sheet['!cols'] = colWidths;
  return [name, sheet];
};

export const getReportWorkbook = (period: Period, periods: Period[]): WorkBook => {
  const workbook = utils.book_new();

  // Report 1
  const [name, sheet] = getReportSheet1(period, periods);
  utils.book_append_sheet(workbook, sheet, name);

  return workbook;
};
