import { findNextMilestone } from '@ien/common/dist/helper/find-next-milestone';
import { Fragment, useEffect, useState } from 'react';

import { AclMask, PageOptions, Pagination } from '@components';
import {
  Access,
  ApplicantStatusAuditRO,
  formatDate,
  IENApplicantUpdateStatusDTO,
  StatusCategory,
} from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import disabledEditIcon from '@assets/img/disabled_edit.svg';
import { getHumanizedDuration, updateMilestone } from '@services';
import { useApplicantContext } from '../applicant/ApplicantContext';
import { useAuthContext } from '../AuthContexts';
import { AddMilestone } from './recruitment/AddMilestone';
import { Milestone } from './recruitment/Milestone';
import dayjs from 'dayjs';

interface MilestoneTableProps {
  category: string | StatusCategory;
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
  const { applicant, milestones, fetchApplicant } = useApplicantContext();

  const [filteredMilestones, setFilteredMilestones] = useState<ApplicantStatusAuditRO[]>([]);
  const [milestonesInPage, setMilestonesInPage] = useState<ApplicantStatusAuditRO[]>([]);
  const [editing, setEditing] = useState<ApplicantStatusAuditRO | null>(null);
  const [activeEdit, setActiveEdit] = useState(0);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAB_PAGE_SIZE);

  useEffect(
    function filterMilestones() {
      const audits =
        milestones
          ?.filter(audit => {
            return audit.status.category === category;
          })
          .sort((b, a) => {
            if (a.start_date === b.start_date) {
              return dayjs(a.updated_date).diff(b.updated_date);
            }
            return dayjs(a.start_date).diff(b.start_date);
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
      fetchApplicant();
    }
  };

  const handlePageOptions = (options: PageOptions) => {
    setPageSize(options.pageSize);
    setPageIndex(options.pageIndex);
  };

  const getNextMilestone = (
    milestone: ApplicantStatusAuditRO,
  ): ApplicantStatusAuditRO | undefined => {
    const mergedMilestones =
      applicant?.jobs
        ?.map(job => job.status_audit || [])
        .reduce((a, c) => a.concat(c), [...milestones]) || milestones;
    return findNextMilestone(milestone, mergedMilestones);
  };

  const getDuration = (milestone: ApplicantStatusAuditRO): string => {
    const start = milestone.start_date;
    if (!start) return '-';

    const end = getNextMilestone(milestone)?.start_date;

    if (start === end) return '0 days';

    return getHumanizedDuration(start, end);
  };

  const canAddEditNonRecruitmentMilestone = () => {
    // success: no ats1_id(not from ATS), ha id exists, applicant is part of same ha as logged-in user
    return !applicant.ats1_id && authUser?.ha_pcn_id && !editing;
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
                      <Milestone
                        milestone={audit}
                        editing={editing}
                        onEditing={setEditing}
                        handleSubmit={values => handleUpdateMilestone(audit.id, values)}
                        category={category}
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
            <AddMilestone category={category} />
          )}
        </AclMask>
      </div>
      <Pagination
        id='milestone-page'
        pageOptions={{ pageIndex, pageSize, total: filteredMilestones.length }}
        onChange={handlePageOptions}
      />
    </div>
  );
};
