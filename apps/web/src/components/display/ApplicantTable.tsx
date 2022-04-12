import Link from 'next/link';
import sortIcon from '@assets/img/sort.svg';
import { buttonBase, buttonColor } from '@components';
import { ApplicantRO, formatDate } from '@ien/common';

export interface ApplicantTableProps {
  applicants: ApplicantRO[];
  onSortChange: (field: string) => void;
}

export const ApplicantTable = (props: ApplicantTableProps) => {
  const { applicants, onSortChange } = props;

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full'>
        <thead className='whitespace-nowrap bg-gray-100'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-3'>
              <div className='flex align-middle justify-between '>
                <span>ID</span>
                <button id='sort-by-id' onClick={() => onSortChange('id')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6 py-3'>
              <div className='flex align-middle justify-between '>
                <span>Name</span>
                <button id='sort-by-name' onClick={() => onSortChange('name')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6 py-3 w-1/4'>Current Milestones</th>
            <th className='px-6 py-3'>Last Updated</th>
            <th className=''></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            applicants.map((app: ApplicantRO) => (
              <tr key={app.id} className='text-left whitespace-nowrap even:bg-gray-100 text-sm '>
                <td className='pl-6 py-3'>{app.applicant_id}</td>
                <td className='px-6 py-3'>{app.name}</td>
                <td className='px-6 py-3'>{app.status?.status}</td>
                <td className='px-6 py-3'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6 py-3 text-right'>
                  <Link
                    href={{
                      pathname: `details/${app.id}`,
                      query: {
                        applicantId: app.id,
                      },
                    }}
                    as={`details/${app.id}`}
                  >
                    <a className={`px-4 ${buttonColor.outline} ${buttonBase}`}>Details</a>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
