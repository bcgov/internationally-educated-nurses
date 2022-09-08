import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
export class AuthService {
  jwksClient = jwksRsa({
    jwksUri: `https://keycloak.freshworks.club/auth/realms/ien/protocol/openid-connect/certs`,
  });

  extractToken = (headers: { [key: string]: string }): string | undefined => {
    
    if (headers.authorization) {
      const auth = headers.authorization.split(' ');
      const type = auth[0].toLowerCase();
      if (type !== 'bearer') {
        throw new HttpException('Bearer token not found', HttpStatus.BAD_REQUEST);
      }
      return auth[1];
    } else if (headers['x-api-key']) {
      return headers['x-api-key'];
    }
  };

  async getUserFromToken(token: string) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      const kid = decoded?.header.kid;
      const jwks = await this.jwksClient.getSigningKey(kid);
      const signingKey = jwks.getPublicKey();
      const verified = jwt.verify(token || '', signingKey);
      if (typeof verified !== 'string' && verified.azp !== 'IEN') {
        throw new HttpException('Authentication token does not match', HttpStatus.FORBIDDEN);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { ...user }: any = decoded?.payload;
      return user;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new BadRequestException('Authentication token expired');
      }
      throw e;
    }
  }
}
