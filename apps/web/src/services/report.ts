import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import dayjs from 'dayjs';
import { utils, WorkBook, WorkSheet } from 'xlsx-js-style';
import { toast } from 'react-toastify';

import { MILESTONES, Period, PeriodFilter } from '@ien/common';
import { convertToParams, notifyError } from '../utils';
import { isoCountries } from './constants';

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

export const getMilestoneDataExtract = async (filter?: PeriodFilter) => {
  const url = `/reports/applicant/extract-milestones?${convertToParams(filter)}`;
  const { data } = await axios.get(url);
  return data?.data;
};

export const getReportByEOI = async (filter?: PeriodFilter) => {
  try {
    const url = `/reports/applicant/registered?${convertToParams(filter)}`;
    const response = await axios.get<{ data: Period[] }>(url);
    return response?.data?.data;
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

/**
 * format cells of data block(except header and title column) in the number format
 *
 * @param sheet
 * @param rows
 */
const applyNumberFormat = (sheet: WorkSheet, rows: any[][]): void => {
  // skip if rows is not an array of arrays
  const maxColumn = _.max(rows.map(_.size));
  if (typeof maxColumn !== 'number') return;

  // format each cell
  for (let rowIndex = 0; rowIndex <= rows.length; ++rowIndex) {
    for (let columnIndex = 0; columnIndex <= maxColumn; ++columnIndex) {
      const cell = sheet[utils.encode_cell({ r: rowIndex, c: columnIndex })];

      // skip if value is not a number
      if (isNaN(+cell?.v)) continue;
      // skip if value is empty or whitespaces
      if (typeof cell.v === 'string' && !cell.v.trim()) continue;

      cell.t = 'n';
      cell.z = '0';
    }
  }
};

const formatTotal = (dataRows: any[][], header: string[]) => {
  return dataRows.map((row, rowIndex) => {
    if (rowIndex === dataRows.length - 1 && /^total/i.exec(row[0])) {
      //format total row
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
      // format total column
      if (header[colIndex]?.search(/total/i) === 0) {
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
  const { description, header, rowProcessor, colWidths, rowSum, colSum, details } = creator;

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
    ...formatTotal(dataRows, headerRow),
  ];

  if (rowSum && dataRows.length) {
    fillTotalRow(rows, dataRows);
  }

  const sheet = utils.aoa_to_sheet(rows);
  if (colWidths) sheet['!cols'] = colWidths.map(wch => ({ wch }));
  if (dataRows.length) {
    applyNumberFormat(sheet, rows);
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
    header: ['', 'IEN Registrants - Old', 'IEN Registrants - New'],
    rowProcessor: (data: Record<string, string | number>[]) => {
      const rows = data.map(Object.values);
      rows.splice(rows.length - 2, 0, []);
      return rows;
    },
    colWidths: [40, 30, 30],
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
      const [from, to] = currentPeriod?.split('~') ?? [];
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
  {
    name: 'Report 10',
    description: 'Average Amount of Time with Each Milestone in Stakeholder Group',
    header: ['', '', 'Mean', 'Median', 'Mode'],
    colWidths: [25, 45, 15, 15, 15],
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

const createDataExtractWorkBook = (data: object[], sheetName: string): WorkBook => {
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, utils.json_to_sheet(data), sheetName);

  const legend = Object.keys(isoCountries).map(code => ({
    Code: code,
    Country: isoCountries[code as keyof typeof isoCountries].name,
  }));
  utils.book_append_sheet(workbook, utils.json_to_sheet(legend), 'Legend');
  return workbook;
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

    const columns = [
      'Applicant ID',
      'Registration Date',
      'Assigned to',
      'Country of Residence',
      'PR Status',
      'Nursing Education',
      'Country of Citizenship',
      'Pathway',
      'Type',
      ...MILESTONES,
    ];

    const data = applicants.map((a: object) => _.pick(a, columns));
    return createDataExtractWorkBook(data, 'Rows as Users');
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
    return null;
  }
};

export const createMilestoneDataExtractWorkbook = async (
  filter: PeriodFilter,
): Promise<WorkBook | null> => {
  try {
    const milestones = await getMilestoneDataExtract(filter);
    if (!milestones || milestones.length === 0) {
      toast.error('There is no milestone data to extract during this time period');
      return null;
    }
    return createDataExtractWorkBook(milestones, 'Rows as Milestones');
  } catch (e) {
    if (e instanceof Error) {
      toast.error(e.message);
    }
    return null;
  }
};

const REPORT_URLS = [
  'registered',
  'education-country',
  'hired-withdrawn-active',
  'licensing-stage',
  'license',
  'recruitment',
  'immigration',
  'ha-current-period-fiscal',
  'average-time-with-stakeholder-group',
  'average-time-of-milestones',
];

const fetchReports = async (filter: PeriodFilter) => {
  const params = convertToParams(filter);
  const reports = [];
  for (let i = 0; i < REPORT_URLS.length; i++) {
    const report = await axios.get(`/reports/applicant/${REPORT_URLS[i]}?${params}`);
    reports.push(report);
  }
  return reports
    .map(r => r.data?.data)
    .reduce((a, c, index) => {
      return { ...a, [`report${index + 1}`]: c };
    }, {});
};

export const createReportWorkbook = async (filter: PeriodFilter): Promise<WorkBook | null> => {
  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, getSummarySheet(filter), 'Summary');

  try {
    const reports = await fetchReports(filter);

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
