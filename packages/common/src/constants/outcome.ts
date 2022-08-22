import { STATUS } from '../enum';

export enum OutcomeType {
  Prescreen = 'Prescreen completed',
  Interview = 'Interview completed',
  Reference = 'References completed',
  Competition = 'Competition outcome',
}

export interface OutcomeGroup {
  value: OutcomeType;
  milestones: STATUS[];
}

export const OutcomeGroups = [
  {
    value: OutcomeType.Prescreen,
    milestones: [
      STATUS.Candidate_passed_the_prescreen,
      STATUS.Candidate_did_not_pass_the_prescreen,
    ],
  },
  {
    value: OutcomeType.Interview,
    milestones: [
      STATUS.Candidate_passed_the_interview,
      STATUS.Candidate_did_not_pass_the_interview,
    ],
  },
  {
    value: OutcomeType.Reference,
    milestones: [
      STATUS.Candidate_passed_the_reference_check,
      STATUS.Candidate_did_not_pass_the_reference_check,
    ],
  },
  {
    value: OutcomeType.Competition,
    milestones: [
      STATUS.Candidate_accepted_the_job_offer, // TODO: change to 'Job offer accepted'
      STATUS.Job_offer_not_accepted,
      STATUS.Job_competition_cancelled,
      STATUS.HA_was_not_interested,
      STATUS.No_position_available,
      STATUS.Candidate_withdrew,
    ],
  },
];
