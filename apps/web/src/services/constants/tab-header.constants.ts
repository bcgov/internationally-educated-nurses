import { ValidRoles } from '@ien/common';

export const landingPageTabs = [
  { title: 'All', value: '1' },
  { title: 'IEN HMBC Process', value: '2' },
  { title: 'IEN Licensing/Registration', value: '3' },
  { title: 'IEN Recruitment', value: '4' },
  { title: 'BC PNP', value: '5' },
  { title: 'Final', value: '6' },
];

export const milestoneTabs = [
  { title: 'Intake', value: 1 },
  { title: 'Licensing/Registration', value: 2 },
  { title: 'Recruitment', value: 3 },
  { title: 'BC PNP', value: 4 },
  { title: 'Final', value: 5 },
];

export const menuBarTabs = [
  {
    title: 'Manage Applicants',
    defaultPath: '/',
    paths: ['/applicants', '/details'],
    roles: [
      ValidRoles.HEALTH_AUTHORITY,
      ValidRoles.HEALTH_MATCH,
      ValidRoles.MINISTRY_OF_HEALTH,
      ValidRoles.ROLEADMIN,
    ],
  },
  {
    title: 'Reporting',
    defaultPath: '/reporting',
    paths: ['/reporting'],
    roles: [
      ValidRoles.HEALTH_AUTHORITY,
      ValidRoles.HEALTH_MATCH,
      ValidRoles.MINISTRY_OF_HEALTH,
      ValidRoles.ROLEADMIN,
    ],
  },
  {
    title: 'User Management',
    defaultPath: '/user-management',
    paths: ['/user-management'],
    roles: [ValidRoles.ROLEADMIN],
  },
];
