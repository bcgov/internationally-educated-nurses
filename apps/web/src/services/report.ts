import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import { convertToParams, Period, PeriodFilter } from '@ien/common';
import { notifyError } from '../utils/notify-error';
import dayjs from 'dayjs';
import { utils, WorkBook, WorkSheet } from 'xlsx';

interface SheetData {
  name: string;
  data: string[][];
  colWidths?: { wch: number }[];
}

interface EducationCountry extends PeriodFilter {
  period: number;
  us: number;
  uk: number;
  ireland: number;
  australia: number;
  philippines: number;
  india: number;
  nigeria: number;
  jamaica: number;
  kenya: number;
  canada: number;
  other: number;
  'n/a': number;
  total: number;
}

export const getPeriods = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/registered?${convertToParams(filter)}`;
    const { data } = await axios.get<{ data: Period[] }>(url);
    return data?.data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const getEducationCountryReport = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/education-country?${convertToParams(filter)}`;
    const { data } = await axios.get<{ data: EducationCountry[] }>(url);
    return data?.data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const getTimeRange = (period: PeriodFilter): string => {
  const from =
    dayjs(period.from).year() === dayjs(period.to).year()
      ? dayjs(period.from).format('MMM DD')
      : dayjs(period.from).format('MMM DD, YYYY');

  return `${from} - ${dayjs(period.to).format('MMM DD, YYYY')}`;
};

const getRegApplicantsReportData = (periods: Period[]): SheetData => {
  const data = [
    [`${dayjs(periods[0].from).format('MMM DD, YYYY')} to Present`, 'Total Applicants'],
  ];

  data.push(
    ...periods.map(p => {
      return [`Period ${p.period}: ${getTimeRange(p)}`, `${p.applicants}`];
    }),
  );

  const colWidths = [{ wch: 40 }, { wch: 20 }];

  return { name: 'Report 1', data, colWidths };
};

const getReportSheet1 = (periods: Period[]): [string, WorkSheet] => {
  const { name, data, colWidths } = getRegApplicantsReportData(periods);
  const sheet = utils.aoa_to_sheet(data);
  if (colWidths) sheet['!cols'] = colWidths;
  return [name, sheet];
};

const getReportSheet2 = (data: EducationCountry[]): [string, WorkSheet] => {
  const sheetData = data.map(d => {
    return {
      ..._.omit(d, ['from', 'to']),
      period: d.period ? `Period ${d.period}: ${getTimeRange(d)} ` : '',
    };
  });
  const sheet = utils.json_to_sheet(sheetData);
  sheet['!cols'] = [{ wch: 40 }];

  return ['Report 2', sheet];
};

export const getReportWorkbook = (
  periods?: Period[],
  educationCountry?: EducationCountry[],
): WorkBook => {
  const workbook = utils.book_new();

  // Report 1
  if (periods) {
    const [name, sheet] = getReportSheet1(periods);
    utils.book_append_sheet(workbook, sheet, name);
  }

  // Report 2
  if (educationCountry) {
    const [name, sheet] = getReportSheet2(educationCountry);
    utils.book_append_sheet(workbook, sheet, name);
  }

  return workbook;
};
