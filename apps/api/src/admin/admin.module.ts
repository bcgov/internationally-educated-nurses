import { Logger, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  controllers: [AdminController],
  imports: [AuthModule, EmployeeModule],
  providers: [AdminService, Logger],
})
export class AdminModule {}
