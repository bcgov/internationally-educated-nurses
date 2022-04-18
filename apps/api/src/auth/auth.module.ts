import { Module } from '@nestjs/common';
import { EmployeeModule } from 'src/employee/employee.module';
import { AuthService } from './auth.service';

@Module({
  exports: [AuthService],
  providers: [AuthService],
  imports: [EmployeeModule],
})
export class AuthModule {}
