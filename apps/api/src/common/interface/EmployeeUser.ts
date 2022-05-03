import { EmployeeEntity } from 'src/employee/employee.entity';
export interface EmployeeUser extends EmployeeEntity {
  user_id: number | null;
}
