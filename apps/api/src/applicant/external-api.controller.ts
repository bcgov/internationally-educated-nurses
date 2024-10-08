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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import { ExternalAPIService } from './external-api.service';
import { SyncApplicantsAudit } from './entity/sync-applicants-audit.entity';
import { IENUsers } from './entity/ienusers.entity';

import { IENUserFilterAPIDTO, SyncApplicantsResultDTO } from './dto';
import { AuthGuard } from '../auth/auth.guard';
import { JWTGuard } from 'src/auth/jwt.guard';
import { ApplicantSyncRO } from './ro/sync.ro';
import { IENUserLimitFilterAPIDTO } from './dto/ienuser-filter.dto';

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
  @UseGuards(AuthGuard)
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
          'An unknown error occurred while Saving Master table data',
        );
      }
    }
  }
  @ApiOperation({
    summary: `Fetch and Save applicant data`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: SyncApplicantsResultDTO })
  @ApiParam({
    name: 'from',
    type: Date,
    description: 'Start date: default is the last sync date or yesterday',
    required: false,
    example: '2022-01-01',
  })
  @ApiParam({
    name: 'to',
    type: Date,
    description: 'End date: default is today',
    required: false,
    example: '2022-02-01',
  })
  @ApiParam({
    name: 'page',
    type: 'number',
    description: 'Page to fetch',
    required: false,
    example: '6',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/save-applicant')
  async saveApplicant(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('page') page: number,
  ): Promise<SyncApplicantsResultDTO | undefined> {
    try {
      return await this.externalAPIService.saveApplicant(from, to, page);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof BadRequestException) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occurred while Saving Applicant data',
        );
      }
    }
  }

  @ApiOperation({
    summary: `Fetch when was last successful Applicants sync ran`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/sync-applicants-audit')
  async getLatestSuccessfulSync(): Promise<SyncApplicantsAudit[]> {
    return this.externalAPIService.getLatestSuccessfulSync();
  }

  @ApiOperation({
    summary: `Sync Users to ATS`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JWTGuard)
  @Get('/users')
  async getUsers(@Query() filter: IENUserFilterAPIDTO): Promise<[data: IENUsers[], count: number]> {
    return this.externalAPIService.getUsers(filter);
  }

  @ApiOperation({
    summary: `Sync Applicants to ATS`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTGuard)
  @ApiBearerAuth()
  @Get('/applicants')
  async getApplicants(@Query() filter: IENUserLimitFilterAPIDTO): Promise<ApplicantSyncRO[]> {
    return await this.externalAPIService.getApplicants(filter);
  }
}
