import { Role, ValidRoles } from '@ien/common';
import { CSSProperties } from 'react';

export interface StyleOption {
  style?: CSSProperties;
}

export interface RoleOption extends StyleOption {
  value: ValidRoles | string;
  label: string;
}

export interface ChangeRoleOption {
  value: ValidRoles | string;
  label: string;
  style?: CSSProperties;
}

const getRoleOptions = (roles: Role[], excludes: ValidRoles[]): RoleOption[] => {
  return (
    roles
      .filter(role => excludes.every(exclude => exclude !== role.name))
      .map(({ id, name }) => ({ value: `${id}`, label: name.toUpperCase() })) || []
  );
};

export const getRoleSelectOptions = (roles: Role[]): RoleOption[] => {
  return getRoleOptions(roles, [ValidRoles.ROLEADMIN, ValidRoles.PENDING]);
};

export const getRoleFilterOptions = (roles: Role[]): RoleOption[] => {
  return getRoleOptions(roles, [ValidRoles.ROLEADMIN]);
};
