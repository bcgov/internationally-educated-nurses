import { Role, RoleSlug } from '@ien/common';
import { CSSProperties } from 'react';

export interface StyleOption {
  style?: CSSProperties;
}

export interface RoleOption extends StyleOption {
  value: string;
  label: string;
}

export interface ChangeRoleOption {
  value: string;
  label: string;
  style?: CSSProperties;
}

const getRoleOptions = (roles: Role[], excludes: string[]): RoleOption[] => {
  return (
    roles
      .filter(role => excludes.every(exclude => exclude !== role.slug))
      .map(({ id, name }) => ({ value: `${id}`, label: name })) || []
  );
};

export const getRoleSelectOptions = (roles: Role[]): RoleOption[] => {
  return getRoleOptions(roles, [RoleSlug.Admin, RoleSlug.Pending]);
};

export const getRoleFilterOptions = (roles: Role[]): RoleOption[] => {
  return getRoleOptions(roles, [RoleSlug.Admin]);
};
