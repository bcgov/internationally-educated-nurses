import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AclMask, buttonBase, buttonColor } from '@components';
import { ApplicantRO, formatDate, isHmbc, isHired, HealthAuthorities } from '@ien/common';
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
const milestoneText = (applicant: ApplicantRO) => {
  const { status } = applicant;
  if (!status) {
    return <td className='px-6'></td>;
  }

  // if applicant has accepted an offer, show detailed Hired status and checkmark
  if (isHired(status.status)) {
    return (
      <td className='px-6 font-bold text-bcGreenHiredText'>
        Hired
        <img src={hiredCheckmarkIcon.src} alt='hired checkmark' className='inline-block h-6 mx-2' />
      </td>
    );
  }

  return <td className='px-6 truncate'>{status.status}</td>;
};

export const ApplicantTable = (props: ApplicantTableProps) => {
  const { applicants, loading, onSortChange } = props;
  const router = useRouter();

  const { authUser } = useAuthContext();
  const isHAUser = HealthAuthorities.some(a => a.name === authUser?.organization);

  const getApplicantId = (applicant: ApplicantRO): string => {
    const { id, ats1_id } = applicant;
    return `${ats1_id || id}`.substring(0, 8);
  };

  const rowClass = (applicant: ApplicantRO) => {
    const status = applicant.status?.status;
    const classes = ['text-left', 'shadow-xs', 'whitespace-nowrap', 'text-sm'];
    const inactive = applicant.active_flags?.some(
      flag => flag.ha_id === authUser?.ha_pcn_id && !flag.is_active,
    );
    if (isHAUser && inactive) {
      classes.push('text-gray-400', 'even:bg-bcLightGray');
    }
    if (isHmbc(authUser) && isHired(status)) {
      classes.push('bg-bcGreenHiredContainer');
    } else {
      classes.push('even:bg-bcLightGray');
    }
    return classNames(classes);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='text-left w-full table-fixed'>
        <thead className='whitespace-nowrap bg-bcLightGray text-bcDeepBlack'>
          <tr className='border-b-2 border-yellow-300 text-sm'>
            <th className='pl-6 py-4 w-24' scope='col'>
              ID
            </th>
            <th className='px-6' scope='col'>
              <SortButton label='Name' sortKey='name' onChange={onSortChange} />
            </th>
            {isHmbc(authUser) && <th className='px-6 w-1/3'>Current Status</th>}

            <th className='px-6 min-w-[100px]' scope='col'>
              <SortButton label='Last Updated' sortKey='updated_date' onChange={onSortChange} />
            </th>
            <th className='px-6' scope='col'>
              Assigned to
            </th>
            <AclMask authorities={HealthAuthorities}>
              <th className='px-6' scope='col'>
                <SortButton label='Recruiter' sortKey='recruiter' onChange={onSortChange} />
              </th>
            </AclMask>
            <th className='w-32' scope='col'></th>
          </tr>
        </thead>
        <tbody className='text-bcBlack'>
          {applicants &&
            !loading &&
            applicants.map((app: ApplicantRO, index) => (
              <tr key={app.id} className={rowClass(app)}>
                <td className='pl-6'>{getApplicantId(app)}</td>
                <td className='px-6 py-5 truncate'>{app.name}</td>
                {isHmbc(authUser) && milestoneText(app)}

                <td className='px-6'>{app.updated_date && formatDate(app.updated_date)}</td>
                <td className='px-6 truncate'>
                  {app.assigned_to?.map(({ name }) => name).join(', ')}
                </td>
                <AclMask authorities={HealthAuthorities}>
                  <td className='px-6' scope='col'>
                    {app.recruiters?.find(r => r?.organization === authUser?.organization)?.name}
                  </td>
                </AclMask>
                <td className='px-6 text-right'>
                  <Link
                    href={{
                      pathname: `/details`,
                      query: { ...router?.query, id: app.id },
                    }}
                    className={`px-4 ${buttonColor.outline} ${buttonBase} text-bcGray`}
                    id={`details-${index}`}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          {loading && (
            <tr className='text-left shadow-xs whitespace-nowrap even:bg-bcLightGray text-sm'>
              <td colSpan={5} className='h-64'>
                <Spinner size='1x' relative />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
