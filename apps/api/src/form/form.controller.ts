import { SubmissionDTO } from '@ien/common';
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

export class FormController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger, // @Inject(SubmissionService) private readonly submissionService: SubmissionService,
  ) {}

  @ApiOperation({
    summary: 'Insert a new Form',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async name(@Body() body: any): Promise<any> {
    try {
      //return await this.submissionService.saveSubmission(body);
    } catch (e) {
      //this.logger.error(e, SubmissionService.name);
      throw new InternalServerErrorException('An unknown error occured while saving a submission');
    }
  }
}
