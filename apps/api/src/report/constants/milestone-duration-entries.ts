import { STATUS } from '@ien/common';
import { DurationEntry } from '../types';

// helper to generate report 10 stats
export const MILESTONE_DURATION_ENTRIES: DurationEntry[] = [
  { stage: 'NNAS', field: 'nnas' },
  { milestone: STATUS.APPLIED_TO_NNAS, field: 'applied_to_nnas' },
  { milestone: STATUS.SUBMITTED_DOCUMENTS, field: 'submitted_documents' },
  { milestone: STATUS.RECEIVED_NNAS_REPORT, field: 'received_nnas_report' },
  { stage: 'BCCNM & NCAS', field: 'bccnm_ncas' },
  { milestone: STATUS.APPLIED_TO_BCCNM, field: 'applied_to_bccnm' },
  { milestone: STATUS.COMPLETED_LANGUAGE_REQUIREMENT, field: 'completed_language_requirement' },
  { milestone: STATUS.REFERRED_TO_NCAS, field: 'referred_to_ncas' },
  { milestone: STATUS.COMPLETED_CBA, field: 'completed_cba' },
  { milestone: STATUS.COMPLETED_SLA, field: 'completed_sla' },
  { milestone: STATUS.COMPLETED_NCAS, field: 'completed_ncas' },
  { stage: 'Recruitment', field: 'recruitment' },
  { milestone: 'Completed pre-screen (includes both outcomes)', field: 'pre_screen' },
  { milestone: 'Completed interview (includes both outcomes)', field: 'interview' },
  { milestone: 'Completed reference check (includes both outcomes)', field: 'reference_check' },
  { milestone: 'Hired', field: 'hired' },
  { stage: 'Immigration', field: 'immigration' },
  { milestone: STATUS.SENT_FIRST_STEPS_DOCUMENT, field: 'sent_first_steps_document' },
  {
    milestone: STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC,
    field: 'sent_employer_documents_to_hmbc',
  },
  { milestone: STATUS.SUBMITTED_BC_PNP_APPLICATION, field: 'submitted_bc_pnp_application' },
  {
    milestone: STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION,
    field: 'received_confirmation_of_nomination',
  },
  { milestone: STATUS.SENT_SECOND_STEPS_DOCUMENT, field: 'sent_second_steps_document' },
  {
    milestone: STATUS.SUBMITTED_WORK_PERMIT_APPLICATION,
    field: 'submitted_work_permit_application',
  },
  { milestone: 'Immigration Completed', field: 'immigration_completed' },
];
