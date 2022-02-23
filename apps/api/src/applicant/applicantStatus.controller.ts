import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApplicantStatusService } from './applicantStatus.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { ApplicantStatusEntity } from './entity/applicantStatus.entity';
import { AppLogger } from 'src/common/logger.service';

@Controller('applicant-status')
@ApiTags('Applicant Status')
export class ApplicantStatusController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ApplicantStatusService) private readonly applicantStatusService: ApplicantStatusService,
  ) {}

  @ApiOperation({
    summary: `List applicant's status`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getApplicantStatus(): Promise<ApplicantStatusEntity[]> {
    try {
      return await this.applicantStatusService.getApplicantStatus();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicant status');
    }
  }
}
