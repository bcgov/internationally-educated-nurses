import { ApplicantStatusAuditRO } from '../ro';

const compare = (a?: string, b?: string): number => {
  if (a === b) return 0;
  if (!b || (a || '') > b) return 1;
  if (!a || a < b) return -1;
  return 0;
};

export const compareMilestone = (
  a?: ApplicantStatusAuditRO,
  b?: ApplicantStatusAuditRO,
): number => {
  if (a === b) return 0;
  if (!b) return 1;
  if (!a) return -1;

  const result = compare(a.start_date, b.start_date);
  if (result === 0) {
    return compare(a.updated_date, b.updated_date);
  }
  return result;
};
