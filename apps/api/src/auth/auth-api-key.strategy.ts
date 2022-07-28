import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';

// Passport docs - https://docs.nestjs.com/security/authentication
@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly config: ConfigService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey: string, done: any) => {
      return this.validate(apiKey, done);
    });
  }

  public validate = (
    apiKey: string,
    done: (error: Error | null, data: any) => Record<string, never>,
  ) => {
    if (this.config.get<string>('API_KEY') === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException('', 'Invalid API Key'), null);
  };
}
