export enum ValidRoles {
  MINISTRY_OF_HEALTH = 'moh',
  HEALTH_AUTHORITY = 'ha',
  HEALTH_MATCH = 'hmbc',
  PENDING = 'pending',
  ROLEADMIN = 'roleadmin',
}

//@todo determine whether coming from master table
export const roleFilters = [
  { id: '1', r: 'pending' },
  { id: '2', r: 'moh' },
  { id: '3', r: 'hmbc' },
];
