import Link from 'next/link';
import { buttonBase, buttonColor } from '@components';
import { ApplicantRO, formatDate } from '@ien/common';
import { Spinner } from '../Spinner';
import { useRouter } from 'next/router';
import { SortButton } from '../SortButton';

export interface ApplicantTableProps {
  applicants: ApplicantRO[];
  loading?: boolean;
  onSortChange: (field: string) => void;
}

export const ApplicantTable = (props: ApplicantTableProps) => {
  const { applicants, loading, onSortChange } = props;
  const router = useRouter();

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-4' scope='col'>
              <SortButton label='ID' sortKey='applicant_id' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              <SortButton label='Name' sortKey='name' onChange={onSortChange} />
            </th>
            <th className='px-6 w-1/4'>Latest Milestone</th>
            <th className='px-6' scope='col'>
              <SortButton label='Last Updated' sortKey='updated_date' onChange={onSortChange} />
            </th>
            <th className='' scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            !loading &&
            applicants.map((app: ApplicantRO, index) => (
              <tr
                key={app.id}
                className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
              >
                <td className='pl-6'>{app.applicant_id}</td>
                <td className='px-6 py-5'>{app.name}</td>
                <td className='px-6'>{app.status?.status}</td>
                <td className='px-6'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6 text-right'>
                  <Link
                    href={{
                      pathname: `/details`,
                      query: { ...router?.query, id: app.id },
                    }}
                  >
                    <a
                      className={`px-4 ${buttonColor.outline} ${buttonBase} text-bcGray`}
                      id={`details-${index}`}
                    >
                      Details
                    </a>
                  </Link>
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
