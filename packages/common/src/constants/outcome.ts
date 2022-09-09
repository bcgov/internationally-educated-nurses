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
    milestones: [STATUS.PRESCREEN_PASSED, STATUS.PRESCREEN_NOT_PASSED],
  },
  {
    value: OutcomeType.Interview,
    milestones: [STATUS.INTERVIEW_PASSED, STATUS.INTERVIEW_NOT_PASSED],
  },
  {
    value: OutcomeType.Reference,
    milestones: [STATUS.REFERENCE_CHECK_PASSED, STATUS.REFERENCE_CHECK_NOT_PASSED],
  },
  {
    value: OutcomeType.Competition,
    milestones: [
      STATUS.JOB_OFFER_ACCEPTED,
      STATUS.JOB_OFFER_NOT_ACCEPTED,
      STATUS.JOB_COMPETITION_CANCELLED,
      STATUS.HA_NOT_INTERESTED,
      STATUS.NO_POSITION_AVAILABLE,
      STATUS.WITHDREW_FROM_COMPETITION,
    ],
  },
];