import { ValidRoles } from '@ien/common';

export interface RoleOption {
  value: ValidRoles;
}
export const roleSelectOptions: RoleOption[] = [
  { value: ValidRoles.HEALTH_MATCH },
  { value: ValidRoles.MINISTRY_OF_HEALTH },
  // { value: ValidRoles.HEALTH_AUTHORITY }, not using right now
  { value: ValidRoles.PENDING },
];
