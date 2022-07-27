import { Period } from '@ien/common';
import { SortButton } from '../SortButton';
import { Spinner } from '../Spinner';
import { createReportWorkbook, getReportByEOI, getTimeRange } from '@services';
import { buttonBase, buttonColor, PageOptions, Pagination } from '@components';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { writeFile } from 'xlsx-js-style';

const DEFAULT_PAGE_SIZE = 10;
const REPORT_PREFIX = 'ien-report-period';

export const ReportTable = () => {
  const [downloadIndex, setDownloadIndex] = useState(-1);

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

  const downloadReport = async (index: number) => {
    setDownloadIndex(index);
    await download(periods[index]);
    setDownloadIndex(-1);
  };

  return (
    <div className='bg-white p-5 rounded'>
      <div className='text-bcBluePrimary text-lg font-bold mb-4'>Standard Period Report</div>

      <Pagination
        pageOptions={{ pageIndex, pageSize: limit, total }}
        onChange={handlePageOptions}
      />
      <div className='overflow-x-auto'>
        <table className='text-left w-full'>
          <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
            <tr className='border-b-2 border-yellow-300 text-sm'>
              <th className='pl-6 py-4' scope='col'>
                <SortButton label='Period #' sortKey='period' onChange={handleSort} />
              </th>
              <th className='px-6' scope='col'>
                {/*<SortButton label='Time Range' sortKey='from' onChange={onSortChange} />*/}
                Time Range
              </th>
              <th className='' scope='col'></th>
            </tr>
          </thead>
          <tbody className='text-bcBlack'>
            {scopedPeriods &&
              !loading &&
              scopedPeriods.map((period, index) => (
                <tr
                  key={period.period}
                  className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
                >
                  <td className='pl-6 py-5'>{`Period ${period.period}`}</td>
                  <td className='px-6'>{getTimeRange(period)}</td>
                  <td className='px-6 text-right'>
                    {downloadIndex === index ? (
                      <div className='float-right mr-9'>
                        <Spinner className='h-8' relative />
                      </div>
                    ) : (
                      <button
                        className={`px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`}
                        onClick={() => downloadReport(index)}
                      >
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {loading && (
              <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
                <td colSpan={5} className='h-64'>
                  <Spinner className='h-10' relative />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          pageOptions={{ pageIndex, pageSize: limit, total }}
          onChange={handlePageOptions}
        />
      </div>
    </div>
  );
};
