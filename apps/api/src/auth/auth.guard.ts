import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmployeeService } from 'src/employee/employee.service';
import { ValidRoles } from '@ien/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const tokenUser = await this.authService.getUserFromToken(
      this.authService.extractToken(request.headers || '') || '',
    );
    if (!tokenUser) {
      return false;
    }

    const acceptedRoles =
      this.reflector.get<ValidRoles[]>('acceptedRoles', context.getHandler()) || [];
    const employee = await this.employeeService.resolveUser(tokenUser.sub, {
      keycloakId: tokenUser.sub,
      name: tokenUser.preferred_username,
      email: tokenUser.email,
      organization: tokenUser.organization,
    });
    request.user = employee;

    if (
      acceptedRoles.length === 0 ||
      employee.roles.some(role => role.name === ValidRoles.ROLEADMIN)
    )
      return true;

    return (
      acceptedRoles.some(name => employee.roles.some(role => role.name === name)) &&
      !employee.revoked_access_date
    );
  }
}
