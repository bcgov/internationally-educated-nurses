export enum STATUS {
  APPLIED_TO_NNAS = 'Applied to NNAS',
  SUBMITTED_DOCUMENTS = 'Submitted Documents (NNAS Application in Review)',
  RECEIVED_NNAS_REPORT = 'Received NNAS Report',
  COMPLETED_LANGUAGE_REQUIREMENT = 'Completed English Language Requirement',
  APPLIED_TO_BCCNM = 'Applied to BCCNM',
  REFERRED_TO_NCAS = 'Referred to NCAS',
  COMPLETED_CBA = 'Completed Computer-Based Assessment (CBA)',
  COMPLETED_SLA = 'Completed Simulation Lab Assessment (SLA)',
  COMPLETED_NCAS = 'Completed NCAS',
  REFERRED_TO_ADDITIONAL_EDUCTION = 'Referred to Additional Education',
  COMPLETED_ADDITIONAL_EDUCATION = 'Completed Additional Education',
  REFERRED_TO_REGISTRATION_EXAM = 'Referred to Registration Exam',
  NCLEX_WRITTEN = 'NCLEX – Written',
  NCLEX_PASSED = 'NCLEX – Passed',
  REX_PN_WRITTEN = 'REx-PN - Written',
  REX_PN_PASSED = 'REx-PN - Passed',
  BCCNM_PROVISIONAL_LICENSE_LPN = 'BCCNM Provisional Licence LPN',
  BCCNM_PROVISIONAL_LICENSE_RN = 'BCCNM Provisional Licence RN',
  BCCNM_FULL_LICENCE_LPN = 'BCCNM Full Licence LPN',
  BCCNM_FULL_LICENSE_RN = 'BCCNM Full Licence RN',
  REGISTERED_AS_AN_HCA = 'Registered as an HCA',
  REGISTRATION_JOURNEY_COMPLETED = 'Registration Journey Complete',
  WITHDREW_FROM_PROGRAM = 'Withdrew from IEN program',
  READY_FOR_JOB_SEARCH = 'Applicant Ready for Job Search',
  REFERRED_TO_FHA = 'Applicant Referred to FHA',
  REFERRED_TO_FNHA = 'Applicant Referred to FNHA',
  REFERRED_TO_IHA = 'Applicant Referred to IHA',
  REFERRED_TO_NHA = 'Applicant Referred to NHA',
  REFERRED_TO_PHC = 'Applicant Referred to PHC',
  REFERRED_TO_PHSA = 'Applicant Referred to PHSA',
  REFERRED_TO_VCHA = 'Applicant Referred to VCHA',
  REFERRED_TO_VIHA = 'Applicant Referred to VIHA',
  // RECRUITMENT
  REFERRAL_ACKNOWLEDGED = 'Referral Acknowledged/Reviewed',
  PRE_SCREEN_PASSED = 'Candidate Passed Pre-Screen',
  PRE_SCREEN_NOT_PASSED = 'Candidate Did Not Pass Pre-Screen',
  INTERVIEW_PASSED = 'Candidate Passed Interview',
  INTERVIEW_NOT_PASSED = 'Candidate Did Not Pass Interview',
  REFERENCE_CHECK_PASSED = 'Candidate Passed Reference Check',
  REFERENCE_CHECK_NOT_PASSED = 'Candidate Did Not Pass Reference Check',
  JOB_OFFER_ACCEPTED = 'Job Offer Accepted',
  JOB_OFFER_NOT_ACCEPTED = 'Job Offer Not Accepted',
  WITHDREW_FROM_COMPETITION = 'Candidate Withdrew from Competition',
  HA_NOT_INTERESTED = 'HA is Not Interested',
  JOB_COMPETITION_CANCELLED = 'Job Competition Cancelled',
  NO_POSITION_AVAILABLE = 'No Position Available',
  // IMMIGRATION
  SENT_EMPLOYER_DOCUMENTS_TO_HMBC = 'Sent employer documents to HMBC',
  SENT_FIRST_STEPS_DOCUMENT = 'Sent First Steps document to candidate',
  SUBMITTED_BC_PNP_APPLICATION = 'Submitted application to BC PNP',
  RECEIVED_CONFIRMATION_OF_NOMINATION = 'Received Confirmation of Nomination',
  SENT_SECOND_STEPS_DOCUMENT = 'Sent Second Steps document to candidate',
  SUBMITTED_WORK_PERMIT_APPLICATION = 'Submitted Work Permit Application',
  RECEIVED_WORK_PERMIT_APPROVAL_LETTER = 'Received Work Permit Approval Letter',
  RECEIVED_WORK_PERMIT = 'Received Work Permit (Arrival in Canada)',
  SUBMITTED_PR_APPLICATION = 'Submitted PR Application',
  RECEIVED_PR = 'Received Permanent Residency',
}

export const COMPLETED_STATUSES = [
  STATUS.PRE_SCREEN_NOT_PASSED,
  STATUS.INTERVIEW_NOT_PASSED,
  STATUS.REFERENCE_CHECK_NOT_PASSED,
  STATUS.WITHDREW_FROM_PROGRAM,
  STATUS.WITHDREW_FROM_COMPETITION,
  STATUS.HA_NOT_INTERESTED,
  STATUS.NO_POSITION_AVAILABLE,
  STATUS.JOB_COMPETITION_CANCELLED,
  STATUS.JOB_OFFER_ACCEPTED,
  STATUS.JOB_OFFER_NOT_ACCEPTED,
];

export const LIC_REG_STAGE = [
  STATUS.APPLIED_TO_NNAS,
  STATUS.SUBMITTED_DOCUMENTS,
  STATUS.RECEIVED_NNAS_REPORT,
  STATUS.COMPLETED_LANGUAGE_REQUIREMENT,
  STATUS.APPLIED_TO_BCCNM,
  STATUS.REFERRED_TO_NCAS,
  STATUS.COMPLETED_CBA,
  STATUS.COMPLETED_SLA,
  STATUS.COMPLETED_NCAS,
  STATUS.REFERRED_TO_ADDITIONAL_EDUCTION,
  STATUS.COMPLETED_ADDITIONAL_EDUCATION,
  STATUS.REFERRED_TO_REGISTRATION_EXAM,
  STATUS.NCLEX_WRITTEN,
  STATUS.NCLEX_PASSED,
  STATUS.REX_PN_WRITTEN,
  STATUS.REX_PN_PASSED,
  STATUS.BCCNM_PROVISIONAL_LICENSE_LPN,
  STATUS.BCCNM_PROVISIONAL_LICENSE_RN,
  STATUS.BCCNM_FULL_LICENCE_LPN,
  STATUS.BCCNM_FULL_LICENSE_RN,
  STATUS.REGISTERED_AS_AN_HCA,
  STATUS.REGISTRATION_JOURNEY_COMPLETED,
  STATUS.WITHDREW_FROM_PROGRAM,
  STATUS.READY_FOR_JOB_SEARCH,
  STATUS.REFERRED_TO_FHA,
  STATUS.REFERRED_TO_FNHA,
  STATUS.REFERRED_TO_IHA,
  STATUS.REFERRED_TO_NHA,
  STATUS.REFERRED_TO_PHC,
  STATUS.REFERRED_TO_PHSA,
  STATUS.REFERRED_TO_VCHA,
  STATUS.REFERRED_TO_VIHA,
];

export const NNAS_STAGE = [
  STATUS.APPLIED_TO_NNAS,
  STATUS.SUBMITTED_DOCUMENTS,
  STATUS.RECEIVED_NNAS_REPORT,
];

export const BCCNM_NCAS_STAGE = [
  STATUS.COMPLETED_LANGUAGE_REQUIREMENT,
  STATUS.APPLIED_TO_BCCNM,
  STATUS.REFERRED_TO_NCAS,
  STATUS.COMPLETED_CBA,
  STATUS.COMPLETED_SLA,
  STATUS.COMPLETED_NCAS,
];

export const RECRUITMENT_STAGE = [
  STATUS.REFERRAL_ACKNOWLEDGED,
  STATUS.PRE_SCREEN_PASSED,
  STATUS.PRE_SCREEN_NOT_PASSED,
  STATUS.INTERVIEW_PASSED,
  STATUS.INTERVIEW_NOT_PASSED,
  STATUS.REFERENCE_CHECK_PASSED,
  STATUS.REFERENCE_CHECK_NOT_PASSED,
  STATUS.JOB_OFFER_ACCEPTED,
  STATUS.JOB_OFFER_NOT_ACCEPTED,
  STATUS.WITHDREW_FROM_COMPETITION,
  STATUS.HA_NOT_INTERESTED,
  STATUS.JOB_COMPETITION_CANCELLED,
  STATUS.NO_POSITION_AVAILABLE,
];

export const COMPETITION_OUTCOMES = [
  STATUS.JOB_OFFER_ACCEPTED,
  STATUS.JOB_OFFER_NOT_ACCEPTED,
  STATUS.JOB_COMPETITION_CANCELLED,
  STATUS.HA_NOT_INTERESTED,
  STATUS.NO_POSITION_AVAILABLE,
  STATUS.WITHDREW_FROM_COMPETITION,
];

export const IMMIGRATION_STAGE = [
  STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC,
  STATUS.SENT_FIRST_STEPS_DOCUMENT,
  STATUS.SUBMITTED_BC_PNP_APPLICATION,
  STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION,
  STATUS.SENT_SECOND_STEPS_DOCUMENT,
  STATUS.SUBMITTED_WORK_PERMIT_APPLICATION,
  STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER,
  STATUS.RECEIVED_WORK_PERMIT,
  STATUS.SUBMITTED_PR_APPLICATION,
  STATUS.RECEIVED_PR,
];

export const IMMIGRATION_COMPLETE = [
  STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER,
  STATUS.RECEIVED_WORK_PERMIT,
  STATUS.SUBMITTED_PR_APPLICATION,
  STATUS.RECEIVED_PR,
];

export const BCCNM_LICENSE = [
  STATUS.BCCNM_PROVISIONAL_LICENSE_LPN,
  STATUS.BCCNM_PROVISIONAL_LICENSE_RN,
  STATUS.BCCNM_FULL_LICENCE_LPN,
  STATUS.BCCNM_FULL_LICENSE_RN,
];

export const STREAM_TYPE_MILESTONES = [...BCCNM_LICENSE, STATUS.REGISTERED_AS_AN_HCA] as const;

export const MILESTONES = [...LIC_REG_STAGE, ...RECRUITMENT_STAGE, ...IMMIGRATION_STAGE] as const;
