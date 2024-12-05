// src/utils/milestoneUtils.ts

import { PageOptions } from '@components';
import { ApplicantRO, ApplicantStatusAuditRO } from '@ien/common';
import { findNextMilestone } from '@ien/common/dist/helper/find-next-milestone';
import { getHumanizedDuration } from '@services';

export const handlePageOptions =
  (setPageSize: (size: number) => void, setPageIndex: (index: number) => void) =>
  (options: PageOptions) => {
    setPageSize(options.pageSize);
    setPageIndex(options.pageIndex);
  };

export const getNextMilestone = (
  milestone: ApplicantStatusAuditRO,
  applicant: ApplicantRO,
  milestones: ApplicantStatusAuditRO[],
): ApplicantStatusAuditRO | undefined => {
  const mergedMilestones =
    applicant?.jobs
      ?.map(job => job.status_audit || [])
      .reduce((a, c) => a.concat(c), [...milestones]) || milestones;
  return findNextMilestone(milestone, mergedMilestones);
};

export const getDuration = (
  milestone: ApplicantStatusAuditRO,
  applicant: ApplicantRO,
  milestones: ApplicantStatusAuditRO[],
): string => {
  const start = milestone.start_date;
  if (!start) return '-';

  const end = getNextMilestone(milestone, applicant, milestones)?.start_date;

  if (start === end) return '0 days';

  return getHumanizedDuration(start, end);
};
