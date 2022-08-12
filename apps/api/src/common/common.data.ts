export const CommonData = {
  status: ['status', 'status.parent', 'added_by', 'updated_by'],
  audit: [
    'jobs',
    'jobs.ha_pcn',
    'jobs.added_by',
    'jobs.job_title',
    'jobs.job_location',
    'jobs.status_audit',
    'jobs.status_audit.added_by',
    'jobs.status_audit.updated_by',
    'jobs.status_audit.status',
    'applicant_status_audit',
  ],
  applicantaudit: ['applicant_audit', 'applicant_audit.added_by'],
  applicant_job: [
    'ha_pcn',
    'job_title',
    'job_location',
    'status_audit',
    'status_audit.status',
    'status_audit.reason',
    'status_audit.added_by',
    'status_audit.updated_by',
  ],
};
