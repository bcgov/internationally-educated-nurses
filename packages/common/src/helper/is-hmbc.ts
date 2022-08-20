import { EmployeeRO } from '../ro';
import { Authorities } from '../constants';

export const isHmbc = (user?: EmployeeRO): boolean => {
  return !!user && user.organization === Authorities.HMBC.name;
};
