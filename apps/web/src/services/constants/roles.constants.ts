export enum ValidRoles {
  MINISTRY_OF_HEALTH = 'moh',
  HEALTH_AUTHORITY = 'ha',
  HEALTH_MATCH = 'hmbc',
  PENDING = 'pending',
  ROLEADMIN = 'roleadmin',
}

export interface RoleOption {
  id: string;
  role: ValidRoles;
}

//@todo determine whether coming from master table
export const roleFilters: RoleOption[] = [
  { id: '1', role: ValidRoles.PENDING },
  { id: '2', role: ValidRoles.MINISTRY_OF_HEALTH },
  { id: '3', role: ValidRoles.HEALTH_MATCH },
];
