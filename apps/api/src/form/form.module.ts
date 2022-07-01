import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { FormEntity } from './entity/form.entity';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormEntity]), EmployeeModule, AuthModule],
  controllers: [FormController],
  providers: [FormService, Logger],
})
export class FormModule {}
