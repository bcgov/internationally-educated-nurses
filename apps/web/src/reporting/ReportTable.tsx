import { SortButton } from '../components/SortButton';
import { Period } from '@ien/common';
import { Spinner } from '../components/Spinner';
import dayjs from 'dayjs';

export interface ReportTableProps {
  periods: Period[];
  loading?: boolean;
  onSortChange: (field: string) => void;
}

export const ReportTable = (props: ReportTableProps) => {
  const { periods, loading, onSortChange } = props;

  const getTimeRange = (period: Period): string => {
    const from =
      dayjs(period.from).year() === dayjs(period.to).year()
        ? dayjs(period.from).format('MMM DD')
        : dayjs(period.from).format('MMM DD, YYYY');

    return `${from} - ${dayjs(period.to).format('MMM DD, YYYY')}`;
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-4'>
              <SortButton label='Period #' sortKey='period' onChange={onSortChange} />
            </th>
            <th className='px-6'>
              {/*<SortButton label='Time Range' sortKey='from' onChange={onSortChange} />*/}
              Time Range
            </th>
            <th className=''></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {periods &&
            !loading &&
            periods.map(period => (
              <tr
                key={period.period}
                className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
              >
                <td className='pl-6 py-5'>{period.period}</td>
                <td className='px-6'>{getTimeRange(period)}</td>
                <td className='px-6 text-right'>
                  <button className='px-3 py-1 text-bcGray border rounded border-bcGray'>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          {loading && (
            <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
              <td colSpan={5} className='h-64'>
                <Spinner className='h-10' />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
