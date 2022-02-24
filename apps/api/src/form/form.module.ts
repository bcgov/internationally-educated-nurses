import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormEntity } from './entities/form.entity';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormEntity])],
  controllers: [FormController],
  providers: [FormService, Logger],
})
export class FormModule {}
