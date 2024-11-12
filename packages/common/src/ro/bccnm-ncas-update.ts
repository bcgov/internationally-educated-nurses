export interface BccnmNcasUpdate {
  'HMBC Unique ID': string;
  'Date ROS Contract Signed': string | number;
  'First Name'?: string;
  'Last Name'?: string;
  'NCAS Assessment Complete'?: string;
  'Date NCAS Assessment Complete': string;
  'BCCNM Application Complete'?: string;
  'Date BCCNM Application Complete': string;
  'Registration Designation'?: string;
  'ISO Code - Education': string;
  'BCCNM Decision Date'?: string;
  'BCCNM Registration Date'?: string;
  Email?: string;
}

export interface BccnmNcasValidation {
  id: string;
  dateOfRosContract?: string;
  message?: string;
  ncasCompleteDate?: string;
  appliedToBccnm?: string;
  designation?: string;
  countryOfEducation?: string;
  statusId?: string;
  name?: string;
  valid?: boolean;
  bccnmApplicationCompleteDate?: string;
  bccnmDecisionDate?: string;
  bccnmRegistrationDate?: string;
}
