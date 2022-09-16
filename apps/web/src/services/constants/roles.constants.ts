import { Role, RoleSlug } from '@ien/common';
import { SelectOption } from './select-options';

const getRoleOptions = (roles: Role[], excludes: string[]): SelectOption<string>[] => {
  return (
    roles
      .filter(role => excludes.every(exclude => exclude !== role.slug))
      .map(({ id, name }) => ({ value: `${id}`, label: name })) || []
  );
};

export const getRoleFilterOptions = (roles: Role[]): SelectOption<string>[] => {
  return getRoleOptions(roles, [RoleSlug.Admin, RoleSlug.DataExtract]);
};
