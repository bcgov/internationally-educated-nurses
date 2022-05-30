import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import { convertToParams, Period, PeriodFilter } from '@ien/common';
import { notifyError } from '../utils/notify-error';
import dayjs from 'dayjs';
import { CellAddress, utils, WorkBook, WorkSheet } from 'xlsx';

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

const applyNumberFormat = (sheet: WorkSheet, s: CellAddress, e: CellAddress): void => {
  for (let r = s.r; r <= e.r; ++r) {
    for (let c = s.c; c <= e.c; ++c) {
      const cell = sheet[utils.encode_cell({ r, c })];
      if (cell) {
        cell.t = 'n';
        cell.z = '0';
      }
    }
  }
};

const getReportSheet1 = (periods: Period[]): [string, WorkSheet] => {
  const rows = [
    ['Number of New Internationally Educated Nurse Registrant EOIs Processed'],
    [],
    [
      getTimeRange({ from: periods[0].from, to: periods[periods.length - 1].to }),
      'Total' + ' Applicants',
    ],
  ];

  rows.push(
    ...periods.map(p => {
      return [`Period ${p.period}: ${getTimeRange(p)}`, `${p.applicants}`];
    }),
  );

  const colWidths = [{ wch: 40 }, { wch: 20 }];

  const sheet = utils.aoa_to_sheet(rows);
  if (colWidths) sheet['!cols'] = colWidths;

  applyNumberFormat(sheet, { r: 3, c: 1 }, { r: rows.length - 1, c: 1 });

  return ['Report 1', sheet];
};

const getReportSheet2 = (data: EducationCountry[]): [string, WorkSheet] => {
  const rows = [['Country of Training of Internationally Educated Nurse Registrants'], []];

  //remove from and to fields and change period to time range
  const temp = data.map(d => ({
    ..._.omit(d, ['from', 'to']),
    period: d.period ? `Period ${d.period}: ${getTimeRange(d)} ` : 'TOTAL',
  }));

  // add table header
  const headers = Object.keys(temp[0]).map(key => key.toUpperCase());
  headers[0] = getTimeRange({ from: data[0].from, to: data[data.length - 2].to });
  rows.push(headers);

  rows.push(...temp.map(Object.values));
  const sheet = utils.aoa_to_sheet(rows);
  sheet['!cols'] = [{ wch: 40 }]; // column width

  // apply number format
  applyNumberFormat(sheet, { r: 4, c: 1 }, { r: rows.length - 1, c: headers.length });

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
