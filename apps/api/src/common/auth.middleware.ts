import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { ValidRoles } from '@ien/common';
import { EmployeeService } from 'src/employee/employee.service';
import { AuthService } from '../auth/auth.service';
import { AppLogger } from './logger.service';
import { RequestObj } from './interface/RequestObj';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @Inject(AppLogger) private readonly logger: AppLogger,
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}
  async use(
    req: RequestObj,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: { locals: { kcUser: any; roles: ValidRoles } },
    next: NextFunction,
  ) {
    const token: string = this.authService.extractToken(req.headers) || '';

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.BAD_GATEWAY);
    }
    try {
      const user = await this.authService.getUserFromToken(token);
      res.locals.kcUser = user;

      // Retrieve user roles
      const resourceAccess = user['resource_access'];
      if (resourceAccess && process.env.AUTH_CLIENTID) {
        res.locals.roles = resourceAccess[process.env.AUTH_CLIENTID]?.roles;
      }

      req.user = await this.employeeService.resolveUser(user.sub, {
        keycloakId: user.sub,
        name: user.preferred_username,
        email: user.email,
      });

      next();
    } catch (e) {
      this.logger.log('Error triggered inside auth.middleware', e);
      throw new HttpException('Authentication Error', HttpStatus.UNAUTHORIZED);
    }
  }
}
