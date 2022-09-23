import { STATUS } from '../enum';
import { ApplicantJobRO, ApplicantRO, EmployeeRO } from '../ro';

export const isHired = (status?: string) => {
  return status === STATUS.JOB_OFFER_ACCEPTED;
};

export const isJobAccepted = (job: ApplicantJobRO): boolean => {
  if (!job.status_audit?.length) return false;
  return isHired(job.status_audit[job.status_audit.length - 1].status.status);
};

export const hasJobAccepted = (applicant: ApplicantRO): boolean => {
  return !!applicant.jobs?.some(isJobAccepted);
};

export const isHiredByUs = (applicant: ApplicantRO, user?: EmployeeRO): boolean => {
  return !!user?.ha_pcn_id && hasJobAccepted(applicant);
};
