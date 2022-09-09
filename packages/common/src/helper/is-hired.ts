import { STATUS } from '../enum';
import { ApplicantJobRO, ApplicantRO, EmployeeRO } from '../ro';
import dayjs from 'dayjs';

export const isHired = (id?: string | number) => {
  return id === STATUS.JOB_OFFER_ACCEPTED;
};

export const isJobAccepted = (job: ApplicantJobRO): boolean => {
  const selected = job.status_audit?.find(s => isHired(s.status.status));
  const notSelected = job.status_audit?.find(
    s => s.status.status === STATUS.JOB_OFFER_NOT_ACCEPTED,
  );
  return !!selected && (!notSelected || dayjs(selected.start_date).isAfter(notSelected.start_date));
};

export const hasJobAccepted = (applicant: ApplicantRO): boolean => {
  return !!applicant.jobs?.some(isJobAccepted);
};

export const isHiredByUs = (applicant: ApplicantRO, user?: EmployeeRO): boolean => {
  return !!user?.ha_pcn_id && hasJobAccepted(applicant);
};
