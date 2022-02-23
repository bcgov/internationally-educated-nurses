import { FormDTO } from '@ien/common/src/dto';
import {
  Inject,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppLogger } from 'src/common/logger.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { FormService } from './form.service';

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
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async name(@Body() body: FormDTO): Promise<any> {
    try {
      return await this.formService.saveForm(body);
    } catch (e) {
      this.logger.error(e, '');
      throw new InternalServerErrorException('An unknown error occured while saving a submission');
    }
  }
}
