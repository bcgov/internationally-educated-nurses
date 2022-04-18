import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/auth.constants';

export const RouteAcceptsRoles = (...acceptedRoles: ValidRoles[]) =>
  SetMetadata('acceptedRoles', acceptedRoles);
