import { Fragment, useEffect, useState } from 'react';

import { AclMask, PageOptions, Pagination } from '@components';
import {
  Access,
  ApplicantStatusAuditRO,
  formatDate,
  IENApplicantUpdateStatusDTO,
} from '@ien/common';
import { getHumanizedDuration, StatusCategory, updateMilestone } from '@services';
import { useApplicantContext } from '../applicant/ApplicantContext';
import { AddMilestone, EditMilestone } from './recruitment/Milestone';
import { useAuthContext } from '../AuthContexts';
import editIcon from '@assets/img/edit.svg';
import disabledEditIcon from '@assets/img/disabled_edit.svg';

interface MilestoneTableProps {
  category: StatusCategory;
}

const DEFAULT_TAB_PAGE_SIZE = 5;
const EDIT_NON_RECRUITMENT_MILESTONES = false;

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

export const MilestoneTable = ({ category }: MilestoneTableProps) => {
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
          return audit.status.parent?.id === category;
        }) || [];
      setFilteredMilestones(audits);
    },
    [milestones, category, applicant],
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

    if (start === end) return '-';

    return getHumanizedDuration(start, end);
  };

  const canAddEditNonRecruitmentMilestone = () => {
    // success: no applicant_id(not from ATS), ha id exists, applicant is part of same ha as logged-in user
    return (
      !applicant.applicant_id &&
      authUser?.ha_pcn_id &&
      applicant.health_authorities?.some(h => h.id === authUser?.ha_pcn_id) &&
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
                Date
              </th>
              <th className='px-4' scope='col'>
                Duration
              </th>
              {EDIT_NON_RECRUITMENT_MILESTONES && <th className='px-4' scope='col'></th>}
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
                  <td className='pl-8 py-5'>{getStatus(audit)}</td>
                  <td className='px-4'>{formatDate(audit.start_date || '')}</td>
                  <td className='px-4'>{getDuration(audit)}</td>
                  {EDIT_NON_RECRUITMENT_MILESTONES && (
                    <td className='items-center px-4'>
                      <AclMask acl={[Access.APPLICANT_WRITE]}>
                        <button
                          onClick={() => {
                            setEditing(audit);
                            setActiveEdit(index);
                          }}
                          disabled={
                            !canAddEditNonRecruitmentMilestone() || (!!editing && audit === editing)
                          }
                        >
                          <img
                            src={
                              canAddEditNonRecruitmentMilestone()
                                ? editIcon.src
                                : disabledEditIcon.src
                            }
                            alt='edit milestone'
                          />
                        </button>
                      </AclMask>
                    </td>
                  )}
                </tr>
                {EDIT_NON_RECRUITMENT_MILESTONES && (
                  <tr>
                    <td colSpan={5}>
                      <EditMilestone
                        milestone={audit}
                        editing={editing}
                        onEditing={setEditing}
                        handleSubmit={values => handleUpdateMilestone(audit.id, values)}
                        milestoneTabId={category}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!milestonesInPage.length && (
          <div className='w-full flex flex-row justify-center py-5 font-bold'>No Milestones</div>
        )}
        {/* first check if applicant has write access,
        then only show form if applicant was not added by ATS and if current logged-in user added applicant */}
        <AclMask acl={[Access.APPLICANT_WRITE]}>
          {EDIT_NON_RECRUITMENT_MILESTONES && canAddEditNonRecruitmentMilestone() && (
            <AddMilestone milestoneTabId={category} />
          )}
        </AclMask>
      </div>
      <Pagination
        pageOptions={{ pageIndex, pageSize, total: filteredMilestones.length }}
        onChange={handlePageOptions}
      />
    </div>
  );
};
