import { ApplicantStatusAuditRO } from '../ro';
import { compareMilestone } from './compare-status';

export const findNextMilestone = (
  milestone: ApplicantStatusAuditRO,
  list: ApplicantStatusAuditRO[],
): ApplicantStatusAuditRO | undefined => {
  return list.filter(v => compareMilestone(v, milestone) > 0).sort(compareMilestone)[0];
};
