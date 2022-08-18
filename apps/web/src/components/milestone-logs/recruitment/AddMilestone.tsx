import React from 'react';
import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';

import { ApplicantJobRO, IENApplicantAddStatusDTO } from '@ien/common';
import { addMilestone } from '@services';
import { getInitialMilestoneFormValues, MilestoneForm } from './MilestoneForm';
import { useApplicantContext } from '../../applicant/ApplicantContext';

interface AddMilestoneProps {
  job?: ApplicantJobRO;
  milestoneTabId: number;
}

export const AddMilestone = ({ job, milestoneTabId }: AddMilestoneProps) => {
  const { applicant, milestones, fetchApplicant } = useApplicantContext();

  const isDuplicate = ({ status, start_date }: IENApplicantAddStatusDTO) => {
    return job
      ? job.status_audit?.find(m => m.status.id == +status && m.start_date == start_date)
      : milestones.find(m => m.status.id == +status && m.start_date == start_date);
  };

  const handleSubmit = async (
    values: IENApplicantAddStatusDTO,
    helpers?: FormikHelpers<IENApplicantAddStatusDTO>,
  ) => {
    if (isDuplicate(values)) {
      toast.error('Duplicate milestone with same date found');
      return;
    }

    const milestone = await addMilestone(applicant.id, { ...values, job_id: `${job?.id}` });
    if (milestone) {
      fetchApplicant();
    }

    helpers && helpers.resetForm(getInitialMilestoneFormValues());
  };

  return (
    <MilestoneForm<IENApplicantAddStatusDTO>
      job={job}
      handleSubmit={handleSubmit}
      milestoneTabId={milestoneTabId}
    />
  );
};
