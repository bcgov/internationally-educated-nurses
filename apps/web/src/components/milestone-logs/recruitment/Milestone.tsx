import React from 'react';

import { ApplicantJobRO, ApplicantStatusAuditRO, IENApplicantUpdateStatusDTO } from '@ien/common';
import { MilestoneForm } from './MilestoneForm';
import { EditableMilestone } from './EditableMilestone';
import { StatusCategory } from '@services';

interface MilestoneProps {
  job?: ApplicantJobRO;
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => Promise<void>;
  editing: ApplicantStatusAuditRO | null;
  onEditing: (editing: ApplicantStatusAuditRO | null) => void;
  milestoneTabId: StatusCategory | string;
}

export const Milestone: React.FC<MilestoneProps> = props => {
  const { job, milestone, handleSubmit, editing, onEditing, milestoneTabId } = props;
  return (
    <>
      {editing !== milestone ? (
        <EditableMilestone
          milestone={milestone}
          editing={editing}
          handleSubmit={handleSubmit}
          onEditing={onEditing}
        />
      ) : (
        <>
          <MilestoneForm<IENApplicantUpdateStatusDTO>
            job={job}
            milestone={milestone}
            handleSubmit={values => handleSubmit(values)}
            onClose={() => onEditing(null)}
            milestoneTabId={milestoneTabId}
          />
        </>
      )}
    </>
  );
};
