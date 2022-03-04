import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthService {
  constructor() {}
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
}
