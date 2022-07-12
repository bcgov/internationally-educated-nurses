import { EmployeeRO } from '@ien/common';

export interface RequestObj {
  headers: Generickey;
  user: EmployeeRO;
}

interface Generickey {
  [key: string]: string;
}
