import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import dayjs from 'dayjs';
import { CellAddress, utils, WorkBook, WorkSheet } from 'xlsx-js-style';
import { toast } from 'react-toastify';

import { Period, PeriodFilter } from '@ien/common';
import { convertToParams, notifyError } from '../utils';

const bold = { bold: true };
const fgColor = { rgb: 'e6f2ff' };
const headerStyle = {
  fill: { fgColor },
  font: bold,
  alignment: { wrapText: true, horizontal: 'right', vertical: 'top' },
};

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
  const url = `/reports/applicant/extract-data?${convertToParams(filter)}`;
  const { data } = await axios.get(url);
  return data?.data;
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

const formatDataRows = (dataRows: any[][], header: string[]) => {
  return dataRows.map((row, rowIndex) => {
    if (rowIndex === dataRows.length - 1 && row[0]?.match(/^total/i)) {
      return row.map((v, colIndex) => {
        if (colIndex === 0)
          return {
            v: v.toUpperCase(),
            t: 's',
            s: { fill: { fgColor }, font: bold, alignment: { horizontal: 'left' } },
          };
        return { v, t: 'n', s: headerStyle };
      });
    }
    return row.map((v, colIndex) => {
      if (header[colIndex]?.match(/^total/i)) {
        return { v, t: 'n', s: headerStyle };
      }
      return v;
    });
  });
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

  const rows = [
    [{ v: description, t: 's', s: { font: bold, alignment: { horizontal: 'left' } } }],
    [],
    [{ v: getTimeRange(filter) }],
    [],
    headerRow.map(_.upperCase).map(v => ({ v, t: 's', s: headerStyle })),
    ...formatDataRows(dataRows, headerRow),
  ];

  if (rowSum && dataRows.length) {
    rows.push([
      { v: 'TOTAL', t: 's', s: { fill: { fgColor }, font: bold } },
      ...dataRows
        .reduce((total, row) => {
          return total.map((value, index) => +row[index + 1] + +value);
        }, Array(dataRows[0].length - 1).fill(0))
        .map(v => ({ v, t: 'n', s: headerStyle })),
    ]);
  }

  const sheet = utils.aoa_to_sheet(rows);
  if (colWidths) sheet['!cols'] = colWidths.map(wch => ({ wch }));
  if (name !== 'Report 9' && dataRows.length) {
    applyNumberFormat(sheet, { r: 5, c: 1 }, { r: rows.length - 1, c: dataRows[0].length });
  }

  return sheet;
};

const getHeaderFiltered = (excludes: string | string[]) => {
  return (data: Record<string, string | number>[]) => {
    return ['', ...Object.keys(_.omit(data[0], excludes))];
  };
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
    colWidths: [40, 20],
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
          row.period ? `Period ${row.period}: ${getTimeRange(row)}` : 'Total',
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
    header: getHeaderFiltered('title'),
    colWidths: [40, 15, 15, 15, 15],
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
    colWidths: [40, 20],
  },
  {
    name: 'Report 5',
    description: 'Number of Internationally Educated Nurse Registrants Eligible for Job Search',
    apiPath: '/reports/applicant/license',
    header: ['', 'applicants'],
    colWidths: [40, 20],
  },
  {
    name: 'Report 6',
    description: 'Number of Internationally Educated Nurse Registrants in the Recruitment Stage',
    apiPath: '/reports/applicant/recruitment',
    header: getHeaderFiltered('status'),
    colWidths: [30, 20, 20, 20, 20, 20, 20, 20, 15],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 7',
    description: 'Number of Internationally Educated Nurse Registrants in the Immigration Stage',
    apiPath: '/reports/applicant/immigration',
    header: getHeaderFiltered('status'),
    colWidths: [30, 20, 20, 20, 20, 20, 20, 20, 15],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 8',
    description: 'Number of Internationally Educated Nurse Registrants Working in BC',
    apiPath: '/reports/applicant/ha-current-period-fiscal',
    header: ['', 'Current Period', 'Current Fiscal', 'Total to Date'],
    colWidths: [35, 20, 20, 20],
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
    colWidths: [25, 35, 15, 15, 15],
  },
];

const getSummarySheet = (filter: PeriodFilter): WorkSheet => {
  const rows = [
    [
      { v: 'IEN Standard Reports', t: 's', s: { font: bold, fill: { fgColor } } },
      { v: '', t: 's', s: { fill: { fgColor } } },
    ],
    [],
    [{ v: getTimeRange(filter), t: 's' }, ''],
    [],
  ];
  rows.push(...reportCreators.map(c => [c.name.toUpperCase(), c.description]));

  const sheet = utils.aoa_to_sheet(rows);

  sheet['!cols'] = [{ wch: 25 }, { wch: 70 }];
  return sheet;
};

export const getApplicantDataExtractSheet = (applicants: object[]): WorkSheet => {
  // create sheet from applicant data
  return utils.json_to_sheet(applicants);
};

export const createApplicantDataExtractWorkbook = async (
  filter: PeriodFilter,
): Promise<WorkBook | null> => {
  try {
    const applicants = await getApplicantDataExtract(filter);

    if (!applicants || applicants.length === 0) {
      toast.error('There is no Applicant data to extract during this time period');
      return null;
    }
    const workbook = utils.book_new();
    utils.book_append_sheet(
      workbook,
      getApplicantDataExtractSheet(applicants),
      'IEN Applicant Data Extract',
    );
    return workbook;
  } catch {
    return null;
  }
};

export const createReportWorkbook = async (filter: PeriodFilter): Promise<WorkBook | null> => {
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, getSummarySheet(filter), 'Summary');

  try {
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
  } catch (e: any) {
    notifyError(e.message || 'It has failed to create a report');
    return null;
  }
};
