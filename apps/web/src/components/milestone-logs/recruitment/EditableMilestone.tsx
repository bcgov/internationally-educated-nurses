import { Access, ApplicantStatusAuditRO, IENApplicantUpdateStatusDTO } from '@ien/common';
import { AclMask } from '@components';
import editIcon from '@assets/img/edit.svg';
import { DeleteMilestoneModal } from '../../display/DeleteMilestoneModal';
import React, { useState } from 'react';
import deleteIcon from '@assets/img/trash_can.svg';
import disabledDeleteIcon from '@assets/img/disabled-trash_can.svg';
import { useAuthContext } from '../../AuthContexts';
import { MilestoneView } from './MilestoneView';

interface EditableMilestoneProps {
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => Promise<void>;
  editing: ApplicantStatusAuditRO | null;
  onEditing: (editing: ApplicantStatusAuditRO | null) => void;
}

export const EditableMilestone = (props: EditableMilestoneProps) => {
  const { milestone, editing, onEditing } = props;

  const { authUser } = useAuthContext();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const canDelete = (loggedInId?: string | null, addedById?: string) => {
    return loggedInId && loggedInId.toString() === addedById;
  };

  return (
    <MilestoneView milestone={milestone}>
      <AclMask acl={[Access.APPLICANT_WRITE]}>
        <button
          className='ml-auto mr-2'
          onClick={() => onEditing(milestone)}
          disabled={!!editing && milestone === editing}
        >
          <img src={editIcon.src} alt='edit milestone' />
        </button>
        {canDelete(authUser?.user_id, milestone.added_by?.id) ? (
          <button onClick={() => setDeleteModalVisible(true)} data-cy='delete milestone'>
            <img src={deleteIcon.src} alt='delete milestone' />
          </button>
        ) : (
          <button className='pointer-events-none' data-cy='delete milestone'>
            <img src={disabledDeleteIcon.src} alt='disabled delete milestone' />
          </button>
        )}
        <DeleteMilestoneModal
          onClose={() => setDeleteModalVisible(false)}
          visible={deleteModalVisible}
          userId={authUser?.user_id}
          milestoneId={milestone.id}
        />
      </AclMask>
    </MilestoneView>
  );
};
