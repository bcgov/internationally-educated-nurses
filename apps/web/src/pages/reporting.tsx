import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { writeFile } from 'xlsx-js-style';

import { Period, ValidRoles } from '@ien/common';
import { createReportWorkbook, getReportByEOI } from '@services';
import { DataExtractReport, PageOptions, Pagination, ReportTable } from '@components';
import withAuth from '../components/Keycloak';

const DEFAULT_PAGE_SIZE = 10;
const REPORT_PREFIX = 'ien-report-period';

const Reporting = () => {
  const [loading, setLoading] = useState(true);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [scopedPeriods, setScopedPeriods] = useState<Period[]>([]);

  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);

  const handlePageOptions = ({ pageIndex: pgIndex, pageSize: pgSize }: PageOptions) => {
    if (pgSize !== limit) {
      setLimit(pgSize);
      setPageIndex(1);
    } else {
      setPageIndex(pgIndex);
    }
  };

  const handleSort = () => {
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };

  const sortPeriods = (periodsToSort: Period[]) => {
    const sorted = [...periodsToSort];
    sorted.sort((a, b) => {
      return (a.period > b.period ? 1 : -1) * (order === 'ASC' ? 1 : -1);
    });
    setPeriods(sorted);
  };

  const download = async (period: Period) => {
    const from = order === 'ASC' ? periods[0].from : periods[periods.length - 1].from;
    const to = dayjs(period.to).format('YYYY-MM-DD');
    const workbook = await createReportWorkbook({ from, to });
    if (workbook) {
      writeFile(workbook, `${REPORT_PREFIX}-${period.period}.xlsx`);
    }
  };

  useEffect(() => {
    setLoading(true);
    getReportByEOI().then(data => {
      if (data) {
        sortPeriods(data);
        setTotal(data.length);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (periods.length <= limit) {
      setScopedPeriods(periods);
    } else {
      setScopedPeriods(periods.slice(limit * (pageIndex - 1), limit * pageIndex));
    }
  }, [periods, pageIndex, limit]);

  useEffect(() => {
    sortPeriods(periods);
    // eslint-disable-next-line
  }, [order]);

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-6'>Reporting</h1>
      <p className='mt-2 mb-5'>
        All the reports are generated based on period. Available reports begin from April 1, 2021
      </p>
      <div className='bg-white p-5 rounded mb-5'>
        <DataExtractReport />
      </div>
      <div className='bg-white p-5 rounded'>
        <div className='text-bcBluePrimary text-lg font-bold mb-4'>Standard Period Report</div>

        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
        <ReportTable
          periods={scopedPeriods}
          onSortChange={handleSort}
          download={download}
          loading={loading}
        />

        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};

export default withAuth(Reporting, [
  ValidRoles.MINISTRY_OF_HEALTH,
  ValidRoles.HEALTH_MATCH,
  ValidRoles.HEALTH_AUTHORITY,
  ValidRoles.ROLEADMIN,
]);
