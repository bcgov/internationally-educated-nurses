import { Fragment, useState } from 'react';

import { AclMask, Pagination } from '@components';
import { Access, ApplicantStatusAuditRO, formatDate, StatusCategory } from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import deleteIcon from '@assets/img/trash_can.svg';
import { useApplicantContext } from '../../applicant/ApplicantContext';
import { useAuthContext } from '../../AuthContexts';
import { useSystem } from './SystemContext';
import { DeleteMilestoneModal } from '@/components/display/DeleteMilestoneModal';
import { handlePageOptions, getDuration } from '@utils/index';
import { useMilestones } from '@/components/admin/hooks/useMilestones';

interface MilestoneTableProps {
  category: string | StatusCategory;
}

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

export const SystemMilestoneTable = ({ category }: MilestoneTableProps) => {
  const { authUser } = useAuthContext();
  const { setOpen, selectedMilestone, setSelectedMilestone } = useSystem();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { applicant, milestones } = useApplicantContext();
  const {
    filteredMilestones,
    milestonesInPage,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    editing,
    setEditing,
    activeEdit,
    setActiveEdit,
  } = useMilestones({
    milestones,
    category,
    applicant,
  });

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
              <th className='px-4' scope='col'>
                Notes
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
                  <td className='pl-8 py-5'>{getStatus(audit)}</td>
                  <td className='px-4'>{formatDate(audit.start_date || '')}</td>
                  <td className='px-4'>{getDuration(audit, applicant, milestones)}</td>
                  <td
                    className='px-4'
                    style={{
                      wordWrap: 'break-word',
                      wordBreak: 'break-all',
                      whiteSpace: 'normal',
                      maxWidth: '100px',
                    }}
                  >
                    {audit.notes}
                  </td>

                  <td className='px-2'>
                    <AclMask acl={[Access.READ_SYSTEM_MILESTONE, Access.WRITE_SYSTEM_MILESTONE]}>
                      <button
                        className='mr-4'
                        onClick={() => {
                          setEditing(audit);
                          setActiveEdit(index);
                          setSelectedMilestone({
                            id: audit.id,
                            start_date: audit.start_date,
                            status: audit?.status?.status,
                            notes: audit.notes,
                          });
                          setOpen(true);
                        }}
                      >
                        <img src={editIcon.src} alt='edit milestone' />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMilestone({
                            id: audit.id,
                            start_date: audit.start_date,
                            status: audit?.status?.status,
                            notes: audit.notes,
                          });
                          setDeleteModalVisible(true);
                        }}
                      >
                        <img src={deleteIcon.src} alt='delete milestone' />
                      </button>
                    </AclMask>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
        {!milestonesInPage.length && (
          <div className='w-full flex flex-row justify-center py-5 font-bold'>No Milestones</div>
        )}
      </div>
      <Pagination
        id='milestone-page'
        pageOptions={{ pageIndex, pageSize, total: filteredMilestones.length }}
        onChange={handlePageOptions(setPageSize, setPageIndex)}
      />
      {!!selectedMilestone && (
        <DeleteMilestoneModal
          onClose={() => setDeleteModalVisible(false)}
          visible={deleteModalVisible}
          userId={authUser?.user_id}
          milestoneId={selectedMilestone.id}
        />
      )}
    </div>
  );
};
