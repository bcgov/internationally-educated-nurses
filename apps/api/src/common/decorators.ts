import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '@ien/common';

export const RouteAcceptsRoles = (...acceptedRoles: ValidRoles[]) =>
  SetMetadata('acceptedRoles', acceptedRoles);
