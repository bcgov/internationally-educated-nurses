import { EmployeeRO } from '../ro';
import { RoleSlug } from '../enum';

export const isAdmin = (user?: EmployeeRO): boolean => {
  return !!user && user.roles.some(role => role.slug === RoleSlug.Admin);
};
