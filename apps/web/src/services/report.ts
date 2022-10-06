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
  // additional information to help to understand the table
  details?: string[] | ((data: any[]) => any[]);
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

export const getTimeRange = ({ from, to }: PeriodFilter): string => {
  const start = dayjs(from).format('MMM DD, YYYY');
  if (to) {
    return `${start} ~ ${dayjs(to).format('MMM DD, YYYY')}`;
  }
  return `${start} ~ `;
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

const fillTotalColumn = (data: Record<string, string | number>[]) => {
  data.forEach(row => {
    row.Total = Object.values(row).reduce((a, c) => {
      return !Number.isNaN(+c) ? +a + +c : a;
    }, 0);
  });
};

const fillTotalRow = (rows: any[][], data: (string | number)[][]) => {
  rows.push([
    { v: 'TOTAL', t: 's', s: { fill: { fgColor }, font: bold } },
    ...data
      .reduce((total, row) => {
        return total.map((value, index) => +row[index + 1] + +value);
      }, Array(data[0].length - 1).fill(0))
      .map(v => ({ v, t: 'n', s: headerStyle })),
  ]);
};
const createSheet = (
  data: Record<string, string | number>[],
  creator: ReportCreator,
  filter: PeriodFilter,
): WorkSheet => {
  const { description, header, rowProcessor, colWidths, rowSum, colSum, name, details } = creator;

  if (colSum) {
    fillTotalColumn(data);
  }

  // object to array
  const dataRows = rowProcessor ? rowProcessor(data, creator) : data.map(Object.values);

  // fill 0 if empty
  dataRows.forEach(row => {
    row.forEach((v, index) => (row[index] = v || 0));
  });
  const headerRow = Array.isArray(header) ? header : header(data, creator);
  const detailRows = Array.isArray(details) ? [details] : (details && [details(data)]) || [];

  const rows = [
    [{ v: description, t: 's', s: { font: bold, alignment: { horizontal: 'left' } } }],
    [],
    ['Report Period', getTimeRange(filter)],
    ...detailRows,
    [],
    headerRow
      .map(_.toUpper)
      .map(v => v.replaceAll('_', ' '))
      .map(v => ({ v, t: 's', s: headerStyle })),
    ...formatDataRows(dataRows, headerRow),
  ];

  if (rowSum && dataRows.length) {
    fillTotalRow(rows, dataRows);
  }

  const sheet = utils.aoa_to_sheet(rows);
  if (colWidths) sheet['!cols'] = colWidths.map(wch => ({ wch }));
  if (dataRows.length) {
    const r = name === 'Report 8' ? 6 : 5; // start row of numbers
    const c = name === 'Report 9' ? 2 : 1; // start col of numbers
    applyNumberFormat(sheet, { r, c }, { r: rows.length - 1, c: dataRows[0].length });
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
    header: getHeaderFiltered('title'),
    colWidths: [40, 15, 15, 15, 15],
  },
  {
    name: 'Report 4',
    description: 'Number of Internationally Educated Nurse Registrants in the Licensing Stage',
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
    header: ['', 'applicants'],
    colWidths: [40, 20],
  },
  {
    name: 'Report 6',
    description: 'Number of Internationally Educated Nurse Registrants in the Recruitment Stage',
    header: getHeaderFiltered('status'),
    colWidths: [30, 20, 20, 20, 20, 20, 20, 20, 15],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 7',
    description: 'Number of Internationally Educated Nurse Registrants in the Immigration Stage',
    header: getHeaderFiltered('status'),
    colWidths: [30, 20, 20, 20, 20, 20, 20, 20, 15],
    rowSum: true,
    colSum: true,
  },
  {
    name: 'Report 8',
    description: 'Number of Internationally Educated Nurse Registrants Working in BC',
    header: (data: Record<string, string | number>[]): string[] => {
      return [
        '',
        ...Object.keys(data[0])
          .slice(1)
          .map(v => {
            return v.includes('current_period') ? `${v.split(' ')[0]}*` : v;
          }),
      ];
    },
    colWidths: [35, 20, 20, 20],
    details: (data: Record<string, string | number>[]): any[] => {
      const currentPeriod = Object.keys(data[0])
        .find(v => v.includes('current_period'))
        ?.split(' ')[1];
      const [from, to] = currentPeriod?.split('~') || [];
      return currentPeriod ? ['Current Period*', getTimeRange({ from, to })] : [];
    },
  },
  {
    name: 'Report 9',
    description: 'Average Amount of Time with Each Stakeholder Group',
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
    ['Report Period', { v: getTimeRange(filter), t: 's' }, ''],
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
    const { data } = await axios.get(`/reports/applicant?${convertToParams(filter)}`);

    const reports = data.data;

    const sheets: { name: string; sheet: WorkSheet }[] = reportCreators.map(creator => {
      const { name, generator } = creator;

      const reportKey = name.toLowerCase().replace(' ', '');
      const reportData = reports[reportKey];

      const sheet = generator
        ? generator(reportData, creator)
        : createSheet(reportData, creator, filter);

      return { name, sheet };
    });

    sheets.forEach(({ name, sheet }) => {
      utils.book_append_sheet(workbook, sheet, name);
    });

    return workbook;
  } catch (e: any) {
    notifyError(e.message || 'There was an issue while attempting to create a report');
    return null;
  }
};
