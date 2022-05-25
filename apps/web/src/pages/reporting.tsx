import { useEffect, useState } from 'react';
import { PageOptions, Pagination } from '../components/Pagination';
import { getPeriods, getReportWorkbook } from '../services/report';
import { Period } from '@ien/common';
import { ReportTable } from '../reporting/ReportTable';
import withAuth from '../components/Keycloak';
import { ValidRoles } from '@services';
import { writeFileXLSX } from 'xlsx';

const DEFAULT_PAGE_SIZE = 10;
const REPORT_PREFIX = 'ien-report-period';

const Reporting = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [scopedPeriods, setScopedPeriods] = useState<Period[]>([]);

  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);

  const handlePageOptions = ({ pageIndex, pageSize }: PageOptions) => {
    if (pageSize !== limit) {
      setLimit(pageSize);
      setPageIndex(1);
    } else {
      setPageIndex(pageIndex);
    }
  };

  const handleSort = () => {
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };

  const sortPeriods = (periods: Period[]) => {
    const sorted = [...periods];
    sorted.sort((a, b) => {
      return (a.period > b.period ? 1 : -1) * (order === 'ASC' ? 1 : -1);
    });
    setPeriods(sorted);
  };

  const download = (period: Period) => {
    const workbook = getReportWorkbook(period, periods);
    writeFileXLSX(workbook, `${REPORT_PREFIX}-${period.period}.xlsx`);
  };

  useEffect(() => {
    getPeriods().then(data => {
      if (data) {
        sortPeriods(data.data);
        setTotal(data.data.length);
      }
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
      <h1 className='font-bold text-3xl pt-5'>Reporting</h1>
      <p className='mt-2 mb-5'>
        All the reports are generated based on period. Available reports begin from April 1, 2021
      </p>
      <div className='bg-white p-5'>
        <div className='opacity-50 mb-7'>{`Showing ${periods.length} reports`}</div>

        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
        <ReportTable periods={scopedPeriods} onSortChange={handleSort} download={download} />

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
