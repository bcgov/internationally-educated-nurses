import { RoleSlug } from './role-slug';
import { Authorities } from '../constants';

export const DefaultRoles: Record<keyof typeof Authorities, RoleSlug[]> = {
  MOH: [RoleSlug.Reporting],
  HMBC: [
    RoleSlug.Provisioner,
    RoleSlug.Reporting,
    RoleSlug.ApplicantRead,
    RoleSlug.ApplicantWrite,
    RoleSlug.DataExtract,
  ],
};
