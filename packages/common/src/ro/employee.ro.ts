export interface EmployeeRO {
  id: string;
  name: string;
  email?: string;
  createdDate: Date;
  role: string;
  revoked_access_date: Date | null;
}
