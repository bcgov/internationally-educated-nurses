import { Role, RoleSlug } from '@ien/common';
import { CSSProperties } from 'react';

export interface StyleOption {
  style?: CSSProperties;
}

export interface SelectOption<T extends string | number> extends StyleOption {
  value: T;
  label?: string;
}

const getRoleOptions = (roles: Role[], excludes: string[]): SelectOption<string>[] => {
  return (
    roles
      .filter(role => excludes.every(exclude => exclude !== role.slug))
      .map(({ id, name }) => ({ value: `${id}`, label: name })) || []
  );
};

export const getRoleFilterOptions = (roles: Role[]): SelectOption<string>[] => {
  return getRoleOptions(roles, [RoleSlug.Admin]);
};
