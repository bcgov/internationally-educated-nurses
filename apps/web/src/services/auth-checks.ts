import { Access, hasAccess, Role, RoleSlug } from '@ien/common';

export const isPending = (roles?: Role[]): boolean => {
  return (
    !roles || roles?.length === 0 || roles?.some((role: Role) => role.slug === RoleSlug.Pending)
  );
};

export const getPath = (roles?: Role[]): string => {
  if (hasAccess(roles, [Access.APPLICANT_READ])) {
    return '/applicants';
  }
  if (hasAccess(roles, [Access.REPORTING])) {
    return '/reporting';
  }
  if (hasAccess(roles, [Access.USER_READ])) {
    return '/user-management';
  }
  return '';
};
