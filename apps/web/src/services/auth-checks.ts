import { ValidRoles } from '@ien/common';
import { UserType } from 'src/components/AuthContexts';

export const isMoh = (user: UserType): boolean => {
  return user?.role === ValidRoles.MINISTRY_OF_HEALTH;
};

export const isPending = (user: UserType): boolean => {
  return user?.role === ValidRoles.PENDING;
};

export const invalidRoleCheck = (roles: ValidRoles[], user: UserType) => {
  return !roles.includes(user.role);
};

export const getPath = (user: UserType): string => {
  if (isMoh(user)) {
    return '/reporting';
  }

  return '/applicants';
};
