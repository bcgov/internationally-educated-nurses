import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Access } from '@ien/common';

export const AllowAccess = (...acl: Access[]) => SetMetadata('acl', acl);

/**
 * get user from request object
 */
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
