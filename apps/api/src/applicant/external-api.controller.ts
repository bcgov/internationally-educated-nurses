import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import { ExternalAPIService } from './external-api.service';

@Controller('external-api')
@ApiTags('External API data process')
export class ExternalAPIController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ExternalAPIService) private readonly externalAPIService: ExternalAPIService,
  ) {}

  @ApiOperation({
    summary: `Fetch and Save Master table data`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/save')
  async saveData(): Promise<unknown> {
    try {
      return await this.externalAPIService.saveData();
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof BadRequestException) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while Saving Master table data',
        );
      }
    }
  }

  @ApiOperation({
    summary: `Fetch and Save applicant data`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/save-applicant')
  async saveApplicant(): Promise<unknown> {
    try {
      return await this.externalAPIService.saveApplicant();
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof BadRequestException) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while Saving Applicant data',
        );
      }
    }
  }
}
