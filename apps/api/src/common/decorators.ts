import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/auth.constants';

export const RouteAcceptsRoles = (...validRoles: ValidRoles[]) =>
  SetMetadata('userTypes', validRoles);
