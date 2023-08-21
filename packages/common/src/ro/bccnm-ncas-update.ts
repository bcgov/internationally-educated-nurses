export interface BccnmNcasUpdate {
  'HMBC Unique ID': string;
  'Date ROS Contract Signed': string | number;
  'First Name'?: string;
  'Last Name'?: string;
  Email?: string;
}

export interface BccnmNcasValidation {
  id: string;
  dateOfRosContract: string;
  message: string;
  statusId?: string;
  name?: string;
  valid?: boolean;
}
