import { ValidRoles } from '@ien/common';
import { CSSProperties } from 'react';

export interface StyleOption {
  style?: CSSProperties;
}

export interface RoleOption extends StyleOption {
  value: ValidRoles;
  label: string;
}

export interface ChangeRoleOption {
  value: ValidRoles | string;
  label: string;
  style?: CSSProperties;
}

export const roleSelectOptions: RoleOption[] = Object.values(ValidRoles)
  .filter(
    role => ![ValidRoles.PENDING, ValidRoles.ROLEADMIN, ValidRoles.HEALTH_AUTHORITY].includes(role),
  )
  .map(role => ({ value: role, label: role.toUpperCase() }));
