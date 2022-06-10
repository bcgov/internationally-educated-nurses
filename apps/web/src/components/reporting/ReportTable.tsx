import { Period } from '@ien/common';
import { SortButton } from '../SortButton';
import { Spinner } from '../Spinner';
import { getTimeRange } from '@services';
import { buttonBase, buttonColor } from '@components';
import { useState } from 'react';

export interface ReportTableProps {
  periods: Period[];
  loading?: boolean;
  onSortChange: (field: string) => void;
  download: (period: Period) => Promise<void>;
}

export const ReportTable = (props: ReportTableProps) => {
  const { periods, loading, onSortChange, download } = props;

  const [downloadIndex, setDownloadIndex] = useState(-1);

  const downloadReport = async (index: number) => {
    setDownloadIndex(index);
    await download(periods[index]);
    setDownloadIndex(-1);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-4' scope='col'>
              <SortButton label='Period #' sortKey='period' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              {/*<SortButton label='Time Range' sortKey='from' onChange={onSortChange} />*/}
              Time Range
            </th>
            <th className='' scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {periods &&
            !loading &&
            periods.map((period, index) => (
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
    </div>
  );
};
