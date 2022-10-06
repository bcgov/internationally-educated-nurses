import { ExecutionContext } from '@nestjs/common';

import { RoleSlug } from '@ien/common';
import { seedUser } from './fixture/ien';

export const canActivate = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  request.user = {
    user_id: request.headers?.user || seedUser.id,
    roles: [{ id: 1, slug: RoleSlug.Admin }],
  };
  return true;
};
