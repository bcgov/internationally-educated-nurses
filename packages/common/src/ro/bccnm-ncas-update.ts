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
  'BCCNM Full Licence LPN'?: string;
  'BCCNM Full Licence RPN'?: string;
  'BCCNM Full Licence RN'?: string;
  'BCCNM Provisional Licence RN'?: string;
  'BCCNM Provisional Licence LPN'?: string;
  'BCCNM Provisional Licence RPN'?: string;
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
  bccnmDecisionDate?: string;
  bccnmFullLicenceLPN?: string;
  bccnmFullLicenceRPN?: string;
  bccnmFullLicenceRN?: string;
  bccnmProvisionalLicenceRN?: string;
  bccnmProvisionalLicenceLPN?: string;
  bccnmProvisionalLicenceRPN?: string;
  bccnmApplicationCompleteDate?: string;
}
