import { ExecutionContext } from '@nestjs/common';

import { EmployeeRO, RoleSlug } from '@ien/common';
import { seedUser } from './fixture/ien';

export const canActivate = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  request.user = {
    user_id: request.headers?.user || seedUser.id,
    roles: [{ id: 1, slug: RoleSlug.Admin }],
  };
  return true;
};

export const mockAuthGuard = (user: Partial<EmployeeRO>) => {
  return {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = user;
      return true;
    },
  };
};

export const mockAuthGuardAsSuper = () => {
  return mockAuthGuard({
    user_id: seedUser.id,
    roles: [{ id: 1, slug: RoleSlug.Admin, name: '', description: '' }],
  });
};
