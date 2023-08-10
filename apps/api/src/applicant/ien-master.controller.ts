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
import { IENMasterService } from './ien-master.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import {
  IENApplicantStatusRO,
  IENEducationRO,
  IENHaPcnRO,
  IENJobLocationRO,
  IENJobTitleRO,
  IENStatusReasonRO,
  IENUserRO,
} from '@ien/common';
@Controller('ienmaster')
@ApiTags('IEN Master')
export class IENMasterController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(IENMasterService) private readonly ienmasterService: IENMasterService,
  ) {}

  @ApiOperation({
    summary: `List applicant's status`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/status')
  async getApplicantStatus(): Promise<IENApplicantStatusRO[]> {
    try {
      return (await this.ienmasterService.getStatus()).map(status => {
        return status.toResponseObject();
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An unknown error occurred retrieving applicant status',
      );
    }
  }

  @ApiOperation({
    summary: `List HA / PCN comm`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/ha-pcn')
  async getHaPcn(): Promise<IENHaPcnRO[]> {
    try {
      return await this.ienmasterService.getHaPcn();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An unknown error occurred retrieving applicant HA/PCN Comm',
      );
    }
  }

  @ApiOperation({
    summary: `List available users`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/users')
  async getUsers(): Promise<IENUserRO[]> {
    try {
      return await this.ienmasterService.getUsers();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An unknown error occurred retrieving available users',
      );
    }
  }

  @ApiOperation({
    summary: `List education title`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/education')
  async getEducation(): Promise<IENEducationRO[]> {
    try {
      return await this.ienmasterService.getEducation();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occurred retrieving education list');
    }
  }

  @ApiOperation({
    summary: `List Job Titles`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/job-titles')
  async getJobTitles(): Promise<IENJobTitleRO[]> {
    try {
      return await this.ienmasterService.getJobTitles();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occurred retrieving Job Titles');
    }
  }

  @ApiOperation({
    summary: `List Job Locations`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/job-locations')
  async getJobLocations(): Promise<IENJobLocationRO[]> {
    try {
      return await this.ienmasterService.getJobLocations();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occurred retrieving Job Locations');
    }
  }

  @ApiOperation({
    summary: `List Milestone/Status reasons`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/reasons')
  async getStatusReasons(): Promise<IENStatusReasonRO[]> {
    try {
      return await this.ienmasterService.getStatusReasons();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(
        'An unknown error occurred retrieving Milestone/Status reasons',
      );
    }
  }
}
