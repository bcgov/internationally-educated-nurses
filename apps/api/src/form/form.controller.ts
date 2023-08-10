import { Access, FormDTO } from '@ien/common';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AppLogger } from 'src/common/logger.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { FormService } from 'src/form/form.service';
import { FormEntity } from './entity/form.entity';
import { AllowAccess } from '../common/decorators';

@Controller('form')
@ApiTags('Form')
@UseGuards(AuthGuard)
export class FormController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    private readonly formService: FormService,
  ) {}

  @ApiOperation({
    summary: 'Insert a new Form',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @AllowAccess(Access.APPLICANT_WRITE)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async name(@Body() body: FormDTO): Promise<FormEntity> {
    try {
      return await this.formService.saveForm(body);
    } catch (e) {
      this.logger.error(e, '');
      throw new InternalServerErrorException('An unknown error occurred while saving a form');
    }
  }
}
