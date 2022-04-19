import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';

import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeEntity } from 'src/employee/employee.entity';
import { ValidRoles } from 'src/auth/auth.constants';
import { AppLogger } from './logger.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @Inject(AppLogger) private readonly logger: AppLogger,
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}
  async use(
    req: { headers: { [key: string]: string } },
    res: { locals: { kcUser: any; roles: ValidRoles; user: EmployeeEntity } },
    next: NextFunction,
  ) {
    const token: string = this.authService.extractToken(req.headers) || '';

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.BAD_GATEWAY);
    }
    try {
      const user: any = await this.authService.getUserFromToken(token);
      res.locals.kcUser = user;

      // Retrieve user roles
      const resourceAccess = user['resource_access'];
      const ltcvx = resourceAccess && resourceAccess[process.env.AUTH_CLIENTID as any];
      const roles = ltcvx && ltcvx.roles;
      res.locals.roles = roles;
      const applicationUser = await this.employeeService.resolveUser(user.sub, {
        keycloakId: user.sub,
        role: 'pending',
        name: user.preferred_username,
        email: user.email,
      });

      res.locals.user = applicationUser;
      next();
    } catch (e: any) {
      this.logger.log('Error triggered inside auth.middleware', e);
      throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);
    }
  }
}
