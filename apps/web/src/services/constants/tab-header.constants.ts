import { Access } from '@ien/common';
import { StatusCategory } from './milestone-logs.constants';

export const landingPageTabs = [
  { title: 'All', value: '1' },
  { title: 'IEN HMBC Process', value: '2' },
  { title: 'IEN Licensing/Registration', value: '3' },
  { title: 'IEN Recruitment', value: '4' },
  { title: 'BC PNP', value: '5' },
  { title: 'Final', value: '6' },
];

export const milestoneTabs = [
  { title: 'Intake', value: StatusCategory.INTAKE },
  { title: 'Licensing/Registration', value: StatusCategory.LICENSING_REGISTRATION },
  { title: 'Recruitment', value: StatusCategory.RECRUITMENT },
  { title: 'BC PNP', value: StatusCategory.BC_PNP },
  { title: 'Final', value: StatusCategory.FINAL },
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
];
