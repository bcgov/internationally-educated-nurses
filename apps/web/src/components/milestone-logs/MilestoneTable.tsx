import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { PageOptions, Pagination } from '../Pagination';
import { ApplicantStatusAuditRO, formatDate, IENApplicantUpdateStatusDTO } from '@ien/common';
import { getHumanizedDuration, updateMilestone } from '@services';
import { useApplicantContext } from '../applicant/ApplicantContext';
import { AddMilestone, EditMilestone } from './recruitment/Milestone';
import { useAuthContext } from '../AuthContexts';
import editIcon from '@assets/img/edit.svg';

interface MilestoneTableProps {
  parentStatus: number;
}

const DEFAULT_TAB_PAGE_SIZE = 5;

const wasAddedByLoggedInUser = (loggedInId?: string | null, addedById?: string) => {
  return loggedInId && loggedInId === addedById;
};

const getStatus = (milestone: ApplicantStatusAuditRO) => {
  const { status } = milestone.status;
  if (!status) return '';

  const label = milestone.status.party || '-';

  return (
    <div className='flex flex-row'>
      <div className='bg-bcGrayLabel px-2 py-0.5 mr-2 text-xs text-white rounded'>{label}</div>
      <div className='text-ellipsis overflow-hidden ...'>{status}</div>
    </div>
  );
};

const currentlyEditing = 'bg-blue-100';

export const MilestoneTable = ({ parentStatus }: MilestoneTableProps) => {
  const { authUser } = useAuthContext();
  const { applicant, milestones, updateMilestoneContext } = useApplicantContext();

  const [filteredMilestones, setFilteredMilestones] = useState<ApplicantStatusAuditRO[]>([]);
  const [milestonesInPage, setMilestonesInPage] = useState<ApplicantStatusAuditRO[]>([]);
  const [editing, setEditing] = useState<ApplicantStatusAuditRO | null>(null);
  const [activeEdit, setActiveEdit] = useState(0);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAB_PAGE_SIZE);

  useEffect(
    function filterMilestones() {
      const audits =
        milestones?.filter(audit => {
          return audit.status.parent?.id === parentStatus;
        }) || [];
      setFilteredMilestones(audits);
    },
    [milestones, parentStatus, applicant],
  );

  useEffect(
    function updateMilestonesInPage() {
      if (!filteredMilestones || (pageIndex - 1) * pageSize > filteredMilestones.length) {
        setPageIndex(1);
      }
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      setMilestonesInPage(filteredMilestones?.slice(start, end) || []);
    },
    [filteredMilestones, pageIndex, pageSize],
  );

  const handleUpdateMilestone = async (id: string, values: IENApplicantUpdateStatusDTO) => {
    setEditing(null);

    const milestone = await updateMilestone(applicant.id, id, values);

    if (milestone) {
      updateMilestoneContext(milestone);
    }
  };

  const handlePageOptions = (options: PageOptions) => {
    setPageSize(options.pageSize);
    setPageIndex(options.pageIndex);
  };

  const getDuration = (milestone: ApplicantStatusAuditRO): string => {
    const start = milestone.start_date;
    let end = milestone.end_date;
    if (!end) {
      const nextMilestone = milestones.filter(m => m.status.id > milestone.status.id)[0];
      if (nextMilestone) {
        end = nextMilestone.start_date;
      }
    }
    return getHumanizedDuration(start, end);
  };

  const canAddNonRecruitmentMilestone = () => {
    return (
      !applicant.applicant_id &&
      wasAddedByLoggedInUser(authUser?.user_id, applicant.added_by?.id) &&
      authUser?.ha_pcn_id &&
      !editing
    );
  };

  return (
    <div>
      <div className='text-bcGray pb-2'>Showing {milestonesInPage.length} logs</div>
      <div>
        <table className='w-full'>
          <thead className=''>
            <tr className='bg-bcLightGray text-bcDeepBlack text-sm text-left border-b-2 border-yellow-300'>
              <th className='py-4 pl-8' scope='col'>
                Milestones
              </th>
              <th className='px-4' scope='col'>
                Start Date
              </th>
              <th className='px-4' scope='col'>
                End Date
              </th>
              <th className='px-4' scope='col'>
                Duration
              </th>
              <th className='px-4' scope='col'></th>
            </tr>
          </thead>
          <tbody className='text-bcBlack'>
            {milestonesInPage.map((audit, index) => (
              <Fragment key={audit.id}>
                <tr
                  className={`text-left text-sm shadow-xs whitespace-nowrap ${
                    editing && activeEdit === index ? currentlyEditing : 'even:bg-bcLightGray'
                  }`}
                >
                  <td className='pl-8 py-5 w-96'>{getStatus(audit)}</td>
                  <td className='px-4'>{formatDate(audit.start_date || '')}</td>
                  {/* temporary placeholder for end date */}
                  <td className='px-4'>
                    {dayjs(formatDate(audit.start_date || ''))
                      .add(1, 'day')
                      .format('MMM DD, YYYY')}
                  </td>
                  <td className='px-4'>{getDuration(audit)}</td>
                  <td className='items-center px-4'>
                    <button
                      className=' '
                      onClick={() => {
                        setEditing(audit);
                        setActiveEdit(index);
                      }}
                      disabled={!!editing && audit === editing}
                    >
                      <img src={editIcon.src} alt='edit milestone' />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <EditMilestone
                      milestone={audit}
                      editing={editing}
                      onEditing={setEditing}
                      handleSubmit={values => handleUpdateMilestone(audit.id, values)}
                      milestoneTabId={parentStatus}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {!milestonesInPage.length && (
          <div className='w-full flex flex-row justify-center py-5 font-bold'>No Milestones</div>
        )}
        {/* only show form if applicant was not added by ATS and if current logged in user added applicant */}
        {canAddNonRecruitmentMilestone() && <AddMilestone milestoneTabId={parentStatus} />}
      </div>
      <Pagination
        pageOptions={{ pageIndex, pageSize, total: filteredMilestones.length }}
        onChange={handlePageOptions}
      />
    </div>
  );
};
