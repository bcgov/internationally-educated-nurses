import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import jwksRsa from 'jwks-rsa';
import { AuthService } from '../auth/auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}
  async use(req: any, res: any, next: NextFunction) {
    const token = this.authService.extractToken(req.headers);

    // @TODO gracefully handle missing token
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.BAD_GATEWAY);
    }
    try {
      const uri = 'https://keycloak.freshworks.club/auth/realms/ien/protocol/openid-connect/certs';
      const jwksClient = jwksRsa({
        jwksUri: uri,
      });
      const decoded = jwt.decode(token as any, { complete: true });
      const kid = decoded?.header.kid;
      const jwks = await jwksClient.getSigningKey(kid);
      const signingKey = jwks.getPublicKey();
      const verified = jwt.verify(token || '', signingKey);
      console.log(verified);
      if (typeof verified !== 'string' && verified.azp !== 'IEN') {
        throw new HttpException('Authentication token does not match', HttpStatus.FORBIDDEN);
      }
      const {
        nonce,
        session_state,
        'allowed-origins': allowedOrigins,
        scope,
        email_verified,
        typ,
        jti,
        ...user
      }: any = decoded?.payload;
      res.locals.kcUser = user;

      // Retrieve user roles
      const resourceAccess = user['resource_access'];
      const ltcvx = resourceAccess && resourceAccess[process.env.AUTH_CLIENTID as any];
      const roles = ltcvx && ltcvx.roles;
      res.locals.roles = roles;
      console.log(user);
      const applicationUser = await this.employeeService.resolveUser(user.sub, {
        keycloakId: user.sub,
        role: 'pending',
        name: user.preferred_username,
        email: user.email,
      });

      res.locals.user = applicationUser;
      next();
    } catch (e) {
      console.log(e);
      throw new HttpException('Authentication header does not match', HttpStatus.BAD_REQUEST);
    }
  }
}
