import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import jwksRsa from 'jwks-rsa';
import { AuthService } from './auth.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: any, res: any, next: NextFunction) {
    const token = this.authService.extractToken(req.headers);

    try {
      const jwksClient = jwksRsa({
        jwksUri: `${process.env.AUTH_URL}/realms/${process.env.AUTH_REALM}/protocol/openid-connect/certs`,
      });
      const decoded = jwt.decode(token as any, { complete: true });
      const kid = decoded?.header.kid;
      const jwks = await jwksClient.getSigningKey(kid);
      const signingKey = jwks.getPublicKey();
      const verified = jwt.verify(token || '', signingKey);
      if (typeof verified !== 'string' && verified.azp !== process.env.AUTH_CLIENTID) {
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

      //   const applicationUser = await resolveUser({
      //     username: user.preferred_username,
      //     keycloakId: user.sub,
      //   });

      //   res.locals.user = applicationUser;
      next();
    } catch (e) {
      throw new HttpException('Authentication header does not match', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
