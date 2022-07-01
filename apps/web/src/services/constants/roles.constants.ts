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

export const getRoleSelectOptions = (roles: Role[]): RoleOption[] => {
  return (
    roles
      .filter(role => role.name !== ValidRoles.ROLEADMIN)
      .map(({ id, name }) => ({ value: `${id}`, label: name.toUpperCase() })) || []
  );
};
