import React from 'react';

import {
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  IENApplicantUpdateStatusDTO,
  StatusCategory,
} from '@ien/common';
import { MilestoneForm } from './MilestoneForm';
import { EditableMilestone } from './EditableMilestone';

interface MilestoneProps {
  job?: ApplicantJobRO;
  milestone: ApplicantStatusAuditRO;
  handleSubmit: (milestone: IENApplicantUpdateStatusDTO) => Promise<void>;
  editing: ApplicantStatusAuditRO | null;
  onEditing: (editing: ApplicantStatusAuditRO | null) => void;
  category: StatusCategory | string;
}

export const Milestone: React.FC<MilestoneProps> = props => {
  const { job, milestone, handleSubmit, editing, onEditing, category } = props;
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
            category={category}
          />
        </>
      )}
    </>
  );
};
