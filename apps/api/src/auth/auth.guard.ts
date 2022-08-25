import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmployeeService } from 'src/employee/employee.service';
import { Access, hasAccess } from '@ien/common';
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

    const token:string | undefined =  this.authService.extractToken(request.headers || '')
    if(!token){
      return false;
    }

    const tokenUser = await this.authService.getUserFromToken(
      token
    );
    if (!tokenUser) {
      return false;
    }

    const employee = await this.employeeService.resolveUser(tokenUser.sub, {
      keycloakId: tokenUser.sub,
      name: tokenUser.preferred_username,
      email: tokenUser.email,
      organization: tokenUser.organization,
    });
    request.user = employee;

    if (request.query?.id && employee.revoked_access_date) return false;

    const acl = this.reflector.get<Access[]>('acl', context.getHandler()) || [];
    return hasAccess(employee.roles, acl);
  }
}
