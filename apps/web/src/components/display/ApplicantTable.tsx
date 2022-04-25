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
      <table className='text-left w-full table-fixed'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='px-6 py-4'>
              <div className='flex align-middle justify-between'>
                <span>ID</span>
                <button id='sort-by-id' onClick={() => onSortChange('applicant_id')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6'>
              <div className='flex align-middle justify-between '>
                <span>Name</span>
                <button id='sort-by-name' onClick={() => onSortChange('name')}>
                  <img src={sortIcon.src} alt='sort' />
                </button>
              </div>
            </th>
            <th className='px-6 w-1/4'>Current Milestones</th>
            <th className='px-6'>Last Updated</th>
            <th className=''></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            applicants.map((app: ApplicantRO) => (
              <tr
                key={app.id}
                className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm '
              >
                <td className='pl-6 py-5'>{app.applicant_id}</td>
                <td className='px-6'>{app.name}</td>
                <td className='px-6'>{app.status?.status}</td>
                <td className='px-6'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6 text-right'>
                  <Link href={`/details?id=${app.id}`}>
                    <a className={`px-4 ${buttonColor.outline} ${buttonBase} text-bcGray`}>
                      Details
                    </a>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
