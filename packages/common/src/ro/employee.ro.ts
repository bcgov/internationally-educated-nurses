import { Role } from './role.ro';

export interface EmployeeRO {
  id: string;
  name: string;
  email?: string;
  createdDate: Date;
  roles: Role[];
  revoked_access_date: Date | null;
}
