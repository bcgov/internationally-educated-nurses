// the enum value maps to 'slug' column of the 'access' table
export enum Access {
  REPORTING = 'reporting',
  USER_READ = 'user-read',
  USER_WRITE = 'user-write',
  APPLICANT_READ = 'applicant-read',
  APPLICANT_WRITE = 'applicant-write',
  DATA_EXTRACT = 'data-extract',
  ADMIN = 'admin',
  BCCNM_NCAS = 'bccnm-ncas',
}
