import { Access } from '../enum';
import { Role } from '../ro';

export const hasAccess = (roles: Role[], acl: Access[]): boolean => {
  return acl.every(access => {
    return roles?.some(role => {
      return role.acl?.some(({ slug }) => slug === access);
    });
  });
};
