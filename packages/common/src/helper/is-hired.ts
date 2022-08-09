import { STATUS } from '../enum';

export const isHired = (id?: number) => {
  return id === STATUS.Candidate_accepted_the_job_offer;
};
