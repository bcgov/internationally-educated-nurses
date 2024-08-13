export interface BccnmNcasUpdate {
  'HMBC Unique ID': string;
  'Date ROS Contract Signed': string | number;
  'First Name'?: string;
  'Last Name'?: string;
  'NCAS Assessment Complete': string;
  'BCCNM Application Complete': string;
  'Registration Designation'?: string;
  'Country of Education': string;
  'Date BCCNM Application Complete'?: string;
  'BCCNM Decision Date'?: string;
  'Date of Registration'?: string;
  Email?: string;
}

export interface BccnmNcasValidation {
  id: string;
  dateOfRosContract?: string;
  message?: string;
  ncasComplete?: string;
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
