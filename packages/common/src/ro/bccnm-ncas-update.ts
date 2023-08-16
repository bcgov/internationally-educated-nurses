export interface BccnmNcasUpdate {
  'HMBC Unique ID': string;
  'Date ROS Contract Signed': string;
  'First Name': string;
  'Last Name': string;
  Email: string;
}

export interface BccnmNcasValidation extends BccnmNcasUpdate {
  message: string;
  valid: boolean;
}
