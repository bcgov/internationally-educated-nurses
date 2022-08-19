import { STATUS } from '../enum';
import { ApplicantRO, EmployeeRO } from '../ro';

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};

export const isHiredByUs = (applicant: ApplicantRO, user?: EmployeeRO): boolean => {
  const { job_accepted } = applicant;
  return !!job_accepted && !!user && job_accepted.ha_pcn.id === user.ha_pcn_id;
};
