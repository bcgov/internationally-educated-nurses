import { AclBase } from './acl-base';

export interface Role extends AclBase {
  id: number;
  name: string;
  slug: string;
  description: string;
  acl?: AclBase[];
}
