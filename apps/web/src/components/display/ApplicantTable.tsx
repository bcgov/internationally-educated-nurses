import Link from 'next/link';

import { buttonBase, buttonColor } from '@components';
import { ApplicantRO, formatDate, IENApplicantStatusRO, STATUS } from '@ien/common';
import { Spinner } from '../Spinner';
import { useRouter } from 'next/router';
import { SortButton } from '../SortButton';
import hiredCheckmarkIcon from '@assets/img/hired_checkmark.svg';
import { useAuthContext } from '../AuthContexts';

export interface ApplicantTableProps {
  applicants: ApplicantRO[];
  loading?: boolean;
  onSortChange: (field: string) => void;
}

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};

// determine milestone text for status
const milestoneText = (id?: number, status?: IENApplicantStatusRO, haId?: number | null) => {
  if (!id && !status) {
    return <td className='px-6'></td>;
  }

  // if applicant has accepted an offer, show detailed Hired status and checkmark
  if (isHired(id)) {
    return (
      <td className='px-6 font-bold text-bcGreenHiredText'>
        Hired
        <img src={hiredCheckmarkIcon.src} alt='hired checkmark' className='inline-block h-6 mx-2' />
      </td>
    );
  }

  // else check if current user is part of a HA and the status is in the Recruitment step
  return haId && status?.parent?.id === STATUS.IEN_Recruitment ? (
    <td className='px-6'>In Progress</td>
  ) : (
    <td className='px-6'>{status?.status}</td>
  );
};

export const ApplicantTable = (props: ApplicantTableProps) => {
  const { applicants, loading, onSortChange } = props;
  const router = useRouter();

  const { authUser } = useAuthContext();

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
            {<th className='px-6 w-1/4'>Current Status</th>}
            <th className='px-6' scope='col'>
              <SortButton label='Last Updated' sortKey='updated_date' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              Assigned to
            </th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            !loading &&
            applicants.map((app: ApplicantRO, index) => (
              <tr
                key={app.id}
                className={`text-left shadow-xs whitespace-nowrap ${
                  isHired(app.status?.id) ? 'bg-bcGreenHiredContainer' : 'even:bg-bcLightGray'
                } text-sm`}
              >
                <td className='pl-6'>{app.applicant_id || 'N/A'}</td>
                <td className='px-6 py-5'>{app.name}</td>
                {milestoneText(app.status?.id, app.status, authUser?.ha_pcn_id)}
                <td className='px-6'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6'>{app.assigned_to?.map(({ name }) => name).join(', ')}</td>
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
