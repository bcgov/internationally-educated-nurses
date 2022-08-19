import Link from 'next/link';
import { useRouter } from 'next/router';
import { buttonBase, buttonColor } from '@components';
import { ApplicantRO, EmployeeRO, formatDate, isHiredByUs, STATUS } from '@ien/common';
import hiredCheckmarkIcon from '@assets/img/hired_checkmark.svg';
import { Spinner } from '../Spinner';
import { SortButton } from '../SortButton';
import { useAuthContext } from '../AuthContexts';

export interface ApplicantTableProps {
  applicants: ApplicantRO[];
  loading?: boolean;
  onSortChange: (field: string) => void;
}

// determine milestone text for status
const milestoneText = (applicant: ApplicantRO, user?: EmployeeRO) => {
  const { status } = applicant;
  if (!status) {
    return <td className='px-6'></td>;
  }

  // if applicant has accepted an offer, show detailed Hired status and checkmark
  if (isHiredByUs(applicant, user)) {
    return (
      <td className='px-6 font-bold text-bcGreenHiredText'>
        Hired
        <img src={hiredCheckmarkIcon.src} alt='hired checkmark' className='inline-block h-6 mx-2' />
      </td>
    );
  }

  // else check if current user is part of a HA and the status is in the Recruitment step
  return user?.ha_pcn_id && status?.parent?.id === STATUS.IEN_Recruitment ? (
    <td className='px-6'>In Progress</td>
  ) : (
    <td className='px-6 truncate'>{status?.status}</td>
  );
};

export const ApplicantTable = (props: ApplicantTableProps) => {
  const { applicants, loading, onSortChange } = props;
  const router = useRouter();

  const { authUser } = useAuthContext();

  const getApplicantId = (applicant: ApplicantRO): string => {
    const { id, applicant_id } = applicant;
    return `${applicant_id || id}`.substring(0, 8);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full table-fixed'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-4 w-24' scope='col'>
              <SortButton label='ID' sortKey='applicant_id' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              <SortButton label='Name' sortKey='name' onChange={onSortChange} />
            </th>
            <th className='px-6 w-1/3'>Current Status</th>
            <th className='px-6 w-36' scope='col'>
              <SortButton label='Last Updated' sortKey='updated_date' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              Assigned to
            </th>
            <th className='w-32' scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            !loading &&
            applicants.map((app: ApplicantRO, index) => (
              <tr
                key={app.id}
                className={`text-left shadow-xs whitespace-nowrap ${
                  isHiredByUs(app, authUser) ? 'bg-bcGreenHiredContainer' : 'even:bg-bcLightGray'
                } text-sm`}
              >
                <td className='pl-6'>{getApplicantId(app)}</td>
                <td className='px-6 py-5 truncate'>{app.name}</td>
                {milestoneText(app, authUser)}
                <td className='px-6'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6 truncate'>
                  {app.assigned_to?.map(({ name }) => name).join(', ')}
                </td>
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
