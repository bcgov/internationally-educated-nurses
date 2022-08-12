import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    req.token = await this.validateToken(req.headers.authorization);

    return true;
  }

  async validateToken(auth: string) {
    const authSplit = auth.split(' ');
    if (authSplit[0] !== 'Bearer') {
      throw new HttpException(
        {
          dev_message: 'Invalid token.',
          client_message: 'You seem to have been logged out. Please log out and log back in again.',
          logout: true,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = authSplit[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_TOKEN ? process.env.JWT_TOKEN : 'jwtsecret',
      );
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + err;
      throw new HttpException(
        {
          dev_message: message,
          client_message: 'You seem to have been logged out. Please log out and log back in again.',
          logout: true,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
