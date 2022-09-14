import { Employee } from '../interfaces';

export interface EmployeeRO extends Employee {
  user_id: string | null;
  ha_pcn_id?: string | null;
}
