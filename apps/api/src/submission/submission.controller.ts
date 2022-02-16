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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubmissionDTO } from '@ehpr/common';
import { SubmissionService } from './submission.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { SubmissionEntity } from './entity/submission.entity';
import { AppLogger } from 'src/common/logger.service';

@Controller('submission')
@ApiTags('Submission')
export class SubmissionController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(SubmissionService) private readonly submissionService: SubmissionService,
  ) {}

  @ApiOperation({
    summary: 'Create a new record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async name(@Body() body: SubmissionDTO): Promise<SubmissionEntity> {
    try {
      return await this.submissionService.saveSubmission(body);
    } catch (e) {
      this.logger.error(e, SubmissionService.name);
      throw new InternalServerErrorException('An unknown error occured while saving a submission');
    }
  }
}
