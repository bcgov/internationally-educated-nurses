import { STATUS } from '@ien/common';

/**
 * duration summary table entry for report 9 and 10
 */
export class DurationSummary {
  // to calculate recruitment durations by authorities in report 9
  ha?: string;

  NNAS?: number;
  [STATUS.APPLIED_TO_NNAS]?: number;
  [STATUS.SUBMITTED_DOCUMENTS]?: number;
  [STATUS.RECEIVED_NNAS_REPORT]?: number;

  'BCCNM & NCAS': number;
  [STATUS.COMPLETED_LANGUAGE_REQUIREMENT]?: number;
  [STATUS.APPLIED_TO_BCCNM]?: number;
  [STATUS.APPLIED_TO_NCAS]?: number;
  [STATUS.COMPLETED_CBA]?: number;
  [STATUS.COMPLETED_SLA]?: number;
  [STATUS.COMPLETED_NCAS]?: number;

  Recruitment?: number;
  // these four milestone are only for report 10
  'Completed pre-screen (includes both outcomes)'?: number;
  'Completed interview (includes both outcomes)'?: number;
  'Completed reference check (includes both outcomes)'?: number;
  'Hired'?: number;

  Immigration?: number;
  [STATUS.SENT_FIRST_STEPS_DOCUMENT]?: number;
  [STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC]?: number;
  [STATUS.SUBMITTED_BC_PNP_APPLICATION]?: number;
  [STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION]?: number;
  [STATUS.SENT_SECOND_STEPS_DOCUMENT]?: number;
  [STATUS.SUBMITTED_WORK_PERMIT_APPLICATION]?: number;
  [STATUS.SUBMITTED_PR_APPLICATION]?: number;
  'Immigration Completed'?: number;
}
