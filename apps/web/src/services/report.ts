import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import { convertToParams, Period, PeriodFilter } from '@ien/common';
import dayjs from 'dayjs';
import { CellAddress, utils, WorkBook, WorkSheet } from 'xlsx';
import { notifyError } from '../utils/notify-error';

interface ReportCreator {
  name: string;
  description: string;
  apiPath: string;
  generator?: (data: any[], creator?: ReportCreator) => WorkSheet;
  header: string[] | ((data: any[], creator?: ReportCreator) => string[]);
  rowProcessor?: (data: any[], creator?: ReportCreator) => (string | number)[][];
  colWidths?: number[];
  rowSum?: boolean;
  colSum?: boolean;
}

export const getApplicantDataExtract = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/extract-data?${convertToParams(filter)}`;
    const { data } = await axios.get(url);
    return data?.data;
  } catch (e) {
    notifyError(e as AxiosError);
  }
};

export const getReportByEOI = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/registered?${convertToParams(filter)}`;
    const { data } = await axios.get<{ data: Period[] }>(url);
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

const createSheet = (
  data: Record<string, string | number>[],
  creator: ReportCreator,
  filter: PeriodFilter,
): WorkSheet => {
  const { description, header, rowProcessor, colWidths, rowSum, colSum, name } = creator;

  if (colSum) {
    data.forEach(row => {
      row.Total = Object.values(row).reduce((a, c) => {
        return !Number.isNaN(+c) ? +a + +c : a;
      }, 0);
    });
  }

  // object to array
  const dataRows = rowProcessor ? rowProcessor(data, creator) : data.map(Object.values);

  // fill 0 if empty
  dataRows.forEach(row => {
    row.forEach((v, index) => (row[index] = v || 0));
  });

  const headerRow = Array.isArray(header) ? header : header(data, creator);

  const rows = [[description], [], [getTimeRange(filter)], headerRow, ...dataRows];

  if (rowSum) {
    rows.push([
      'Total',
      ...dataRows.reduce((total, row) => {
        return total.map((value, index) => +row[index + 1] + +value);
      }, Array(dataRows[0].length - 1).fill(0)),
    ]);
  }

  const sheet = utils.aoa_to_sheet(rows);
  if (colWidths) sheet['!cols'] = colWidths.map(wch => ({ wch }));
  if (name !== 'Report 9') {
    applyNumberFormat(sheet, { r: 4, c: 1 }, { r: rows.length - 1, c: dataRows[0].length });
  }

  return sheet;
};

const reportCreators: ReportCreator[] = [
  {
    name: 'Report 1',
    description: 'Number of New Internationally Educated Nurse Registrant EOIs Processed',
    apiPath: '/reports/applicant/registered',
    header: ['', 'Total Applicants'],
    rowProcessor: (data: Period[]) => {
      return data.map(p => [`Period ${p.period}: ${getTimeRange(p)}`, `${p.applicants}`]);
    },
    colWidths: [40, 15],
    rowSum: true,
  },
  {
    name: 'Report 2',
    description: 'Country of Training of Internationally Educated Nurse Registrants',
    apiPath: '/reports/applicant/education-country',
    header: (data: Record<string, string | number>[]) => {
      if (!data?.length) return [];
      const row = _.omit(data[0], ['period', 'from', 'to']);
      return ['', ...Object.keys(row).map(key => key.toUpperCase())];
    },
    rowProcessor: (data: Record<string, string | number>[]) => {
      return data.map(row => {
        return [
          row.period ? getTimeRange(row) : 'Total',
          ...Object.values(_.omit(row, ['from', 'to', 'period'])),
        ];
      });
    },
    colWidths: [40],
  },
  {
    name: 'Report 3',
    description: 'Status of Internationally Educated Nurse Registrant Applicants',
    apiPath: '/reports/applicant/hired-withdrawn-active',
    header: (data: Record<string, string | number>[]) => {
      return ['', ...Object.keys(_.omit(data[0], 'title'))];
    },
    colWidths: [40],
  },
  {
    name: 'Report 4',
    description: 'Number of Internationally Educated Nurse Registrants in the Licensing Stage',
    apiPath: '/reports/applicant/licensing-stage',
    header: ['', 'IEN Registrants'],
    rowProcessor: (data: Record<string, string | number>[]) => {
      const rows = data.map(Object.values);
      rows.splice(rows.length - 2, 0, []);
      return rows;
    },
    colWidths: [40, 15],
  },
  {
    name: 'Report 5',
    description: 'Number of Internationally Educated Nurse Registrants Eligible for Job Search',
    apiPath: '/reports/applicant/license',
    header: ['', 'applicants'],
    colWidths: [40, 15],
  },
  {
    name: 'Report 6',
    description: 'Number of Internationally Educated Nurse Registrants in the Recruitment Stage',
    apiPath: '/reports/applicant/recruitment',
    header: (data: Record<string, string | number>[]) => {
      return ['', ...Object.keys(_.omit(data[0], 'status'))];
    },
    colWidths: [30, 20, 15, 15, 20, 15, 15, 25, 25],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 7',
    description: 'Number of Internationally Educated Nurse Registrants in the Immigration Stage',
    apiPath: '/reports/applicant/immigration',
    header: (data: Record<string, string | number>[]) => {
      return ['', ...Object.keys(_.omit(data[0], 'status'))];
    },
    colWidths: [40],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 8',
    description: 'Number of Internationally Educated Nurse Registrants Working in BC',
    apiPath: '/reports/applicant/ha-current-period-fiscal',
    header: ['', 'Current Period', 'Current Fiscal', 'Total to Date'],
    colWidths: [30, 15, 15, 15],
  },
  {
    name: 'Report 9',
    description: 'Average Amount of Time with Each Stakeholder Group',
    apiPath: '/reports/applicant/average-time-with-stackholder-group',
    header: ['', '', 'Mean', 'Median', 'Mode'],
    rowProcessor: (data: Record<string, string | number>[]) => {
      const rows = data.map(Object.values);
      rows.splice(2, 0, ['Employer']);
      rows.splice(rows.length - 1, 0, []);
      return rows;
    },
    colWidths: [25, 35, 10, 10, 10],
  },
];

const getSummarySheet = (filter: PeriodFilter): WorkSheet => {
  const rows = [['', 'IEN Standard Reports'], ['', getTimeRange(filter)], []];
  rows.push(...reportCreators.map(c => [c.name, c.description]));

  const sheet = utils.aoa_to_sheet(rows);
  sheet['!cols'] = [{ wch: 10 }, { wch: 70 }];
  return sheet;
};

export const getApplicantDataExtractSheet = (applicants: any[]): WorkSheet => {
  return utils.json_to_sheet(applicants);
};

export const createApplicantDataExtractWorkbook = async (
  filter: PeriodFilter,
): Promise<WorkBook> => {
  // create a new workbook
  const workbook = utils.book_new();

  // get applicant data to populate sheet
  const applicants = await getApplicantDataExtract(filter);

  // create work sheet and append to workbook
  utils.book_append_sheet(
    workbook,
    getApplicantDataExtractSheet(applicants),
    'IEN Applicant Data Extract',
  );

  return workbook;
};

export const createReportWorkbook = async (filter: PeriodFilter): Promise<WorkBook> => {
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, getSummarySheet(filter), 'Summary');

  const sheets: { name: string; sheet: WorkSheet }[] = await Promise.all(
    reportCreators.map(async creator => {
      const { name, apiPath, generator } = creator;

      const { data } = await axios.get(`${apiPath}?${convertToParams(filter)}`);
      const sheet = generator
        ? generator(data.data, creator)
        : createSheet(data.data, creator, filter);

      return { name, sheet };
    }),
  );

  sheets.forEach(({ name, sheet }) => {
    utils.book_append_sheet(workbook, sheet, name);
  });

  return workbook;
};
