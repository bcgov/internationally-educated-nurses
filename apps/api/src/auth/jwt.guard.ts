import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
} from '@nestjs/common';
import dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(@Inject(Logger) private readonly logger: AppLogger) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    req.token = await this.validateToken(req.headers.authorization);
    if (req.token) {
      return true;
    } else {
      return false;
    }
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
      const decoded:{exp:number} = (jwt.verify(
        token,
        process.env.JWT_SECRET ? process.env.JWT_SECRET : 'jwtsecret',
      )) as any;
      if(!decoded.exp){
        return false; 
      }
      // Check token expiry
      // JWT Token expiry is in seconds since the unix epoc, so we need to multiply them by 1000 to convert them into timestamps.
      if(dayjs(decoded?.exp*1000).isAfter(dayjs()) && dayjs(decoded?.exp*1000).isBefore(dayjs().add(5,'minutes')) ){
        return decoded
      }else{
        return false;
      }
    } catch (err) {
      this.logger.log(`Error in jwt guard:` + err);
      return false;
    }
  }
}
