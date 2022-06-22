import { EmployeeEntity } from 'src/employee/entity/employee.entity';
export interface EmployeeUser extends EmployeeEntity {
  user_id: number | null;
}
