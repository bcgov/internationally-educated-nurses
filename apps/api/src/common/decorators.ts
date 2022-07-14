import { SetMetadata } from '@nestjs/common';
import { Access } from '@ien/common';

export const AllowAccess = (...acl: Access[]) => SetMetadata('acl', acl);
