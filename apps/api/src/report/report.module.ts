import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  controllers: [ReportController],
  imports: [
    TypeOrmModule.forFeature([]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmployeeModule),
  ],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
