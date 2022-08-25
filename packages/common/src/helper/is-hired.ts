import { STATUS } from '../enum';
import { ApplicantRO, EmployeeRO } from '../ro';
import { isAdmin } from './is-admin';
import { isHmbc } from './is-hmbc';

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};

export const isHiredByUs = (applicant: ApplicantRO, user?: EmployeeRO): boolean => {
  const { job_accepted, status } = applicant;

  // if current user is HMBC, show applicants latest milestone regardless of accepted job
  if (isHmbc(user)) {
    return isHired(status?.id);
  }

  return (
    !!job_accepted &&
    !!user &&
    (job_accepted.ha_pcn.id === user.ha_pcn_id || isAdmin(user) || isHmbc(user))
  );
};
