import { Access } from '../enum';
import { Role } from '../ro';

export const hasAccess = (roles: Role[], acl: Access[], and = true): boolean => {
  const condition = (access: Access) => {
    return roles?.some(role => {
      return role.acl?.some(({ slug }) => slug === access);
    });
  };
  return and ? acl.every(condition) : acl.some(condition);
};
