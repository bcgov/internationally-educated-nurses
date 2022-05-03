import { EmployeeUser } from './EmployeeUser';

export interface RequestObj {
  headers: Generickey;
  user: EmployeeUser;
}

interface Generickey {
  [key: string]: string;
}
