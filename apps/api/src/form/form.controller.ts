import { FormDTO, ValidRoles } from '@ien/common';
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
  Controller,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { AppLogger } from 'src/common/logger.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { FormService } from 'src/form/form.service';
import { FormEntity } from './entity/form.entity';
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
  @RouteAcceptsRoles(ValidRoles.HEALTH_AUTHORITY, ValidRoles.HEALTH_MATCH)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async name(@Body() body: FormDTO): Promise<FormEntity> {
    try {
      return await this.formService.saveForm(body);
    } catch (e) {
      this.logger.error(e, '');
      throw new InternalServerErrorException('An unknown error occured while saving a form');
    }
  }
}
