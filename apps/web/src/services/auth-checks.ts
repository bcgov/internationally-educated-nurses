import { ValidRoles } from '@ien/common';
import { UserType } from 'src/components/AuthContexts';

export const isMoh = (user: UserType): boolean => {
  return user.roles.some(role => role.name === ValidRoles.MINISTRY_OF_HEALTH);
};

export const isPending = (user: UserType): boolean => {
  return user.roles?.length === 0 || user?.roles.some(role => role.name === ValidRoles.PENDING);
};

export const invalidRoleCheck = (roles: ValidRoles[], user: UserType) => {
  return user.roles.every(role => !roles.some(v => v === role.name));
};

export const getPath = (user: UserType): string => {
  if (isMoh(user)) {
    return '/reporting';
  }

  return '/applicants';
};
