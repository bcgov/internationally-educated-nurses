import { STATUS } from '../enum';
import { ApplicantJobRO } from '../ro';

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};

export const hasAcceptedOfferWithDiffHa = (
  jobs: ApplicantJobRO[],
  currentHa?: number | null,
): boolean => {
  // filter out jobs that are from current HA
  const filteredJobs = jobs.filter(j => j.ha_pcn.id !== currentHa);

  return filteredJobs.some(j => j.status_audit?.some(s => isHired(s.status.id)));
};
