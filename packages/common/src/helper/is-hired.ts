import { ApplicantJobRO, STATUS } from '@ien/common';

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};

export const hasAcceptedOfferWithDiffHa = (
  jobs: ApplicantJobRO[],
  currentHa?: number | null,
): boolean => {
  // filter out jobs that are from current HA
  const filteredJobs = jobs.filter(j => j.ha_pcn.id !== currentHa);

  return filteredJobs.filter(j => j.status_audit?.some(s => isHired(s.status.id))).length > 0;
};
