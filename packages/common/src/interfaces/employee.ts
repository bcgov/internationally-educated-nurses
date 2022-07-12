import { Role } from '../ro';

export interface Employee {
  id: string;
  created_date: Date;
  updated_date: Date;
  name: string;
  email: string;
  roles: Role[];
  keycloakId: string;
  organization: string;
  revoked_access_date: Date | null;
}
