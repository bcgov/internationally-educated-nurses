import React from 'react';
import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';

import { ApplicantJobRO, IENApplicantAddStatusDTO, StatusCategory } from '@ien/common';
import { addMilestone } from '@services';
import { getInitialMilestoneFormValues, MilestoneForm } from './MilestoneForm';
import { useApplicantContext } from '../../applicant/ApplicantContext';

interface AddMilestoneProps {
  job?: ApplicantJobRO;
  category: StatusCategory | string;
}

export const AddMilestone = ({ job, category }: AddMilestoneProps) => {
  const { applicant, fetchApplicant } = useApplicantContext();

  const isDuplicate = ({ status, start_date }: IENApplicantAddStatusDTO) => {
    return (
      job && job.status_audit?.find(m => m.status.status == status && m.start_date == start_date)
    );
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
      category={category}
    />
  );
};
