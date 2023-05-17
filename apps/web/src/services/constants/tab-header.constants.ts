import { Access, StatusCategory } from '@ien/common';

export const milestoneTabs = [
  { title: 'Licensing/Registration', value: StatusCategory.LICENSING_REGISTRATION },
  { title: 'Recruitment', value: StatusCategory.RECRUITMENT },
  { title: 'BC PNP', value: StatusCategory.BC_PNP },
];

export const menuBarTabs = [
  {
    title: 'Manage Applicants',
    defaultPath: '/',
    paths: ['/applicants', '/details'],
    acl: [Access.APPLICANT_READ],
  },
  {
    title: 'Reporting',
    defaultPath: '/reporting',
    paths: ['/reporting'],
    acl: [Access.REPORTING, Access.DATA_EXTRACT],
  },
  {
    title: 'User Management',
    defaultPath: '/user-management',
    paths: ['/user-management'],
    acl: [Access.USER_READ],
  },
  {
    title: 'Admin Maintenance',
    defaultPath: '/admin',
    paths: ['/admin'],
    acl: [Access.ADMIN],
  },
];
