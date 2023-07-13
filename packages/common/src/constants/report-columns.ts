import { MILESTONES } from '../enum';

export const EXTRACT_APPLICANT_HEADERS = [
  'Applicant ID',
  'Registration Date',
  'Assigned to',
  'Country of Residence',
  'PR Status',
  'Nursing Education',
  'Country of Citizenship',
  'Type',
  'Inferred Type',
  ...MILESTONES,
] as const;

export type ExtractApplicantHeader = typeof EXTRACT_APPLICANT_HEADERS[number];
