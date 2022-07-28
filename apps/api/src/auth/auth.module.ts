import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { EmployeeModule } from 'src/employee/employee.module';
import { HeaderApiKeyStrategy } from './auth-api-key.strategy';
import { AuthService } from './auth.service';

@Module({
  exports: [AuthService],
  providers: [AuthService, HeaderApiKeyStrategy],
  imports: [EmployeeModule, PassportModule, ConfigModule],
})
export class AuthModule {}
