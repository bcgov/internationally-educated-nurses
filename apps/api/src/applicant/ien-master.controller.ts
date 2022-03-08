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
import { IENApplicantStatus } from './entity/ienapplicant-status.entity';
import { IENHaPcn } from './entity/ienhapcn.entity';
import { IENUsers } from './entity/ienusers.entity';
import { IENEducation } from './entity/ieneducation.entity';

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
  async getApplicantStatus(): Promise<IENApplicantStatus[]> {
    try {
      return await this.ienmasterService.getStatus();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicant status');
    }
  }

  @ApiOperation({
    summary: `List HA / PCN comm`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/ha-pcn')
  async getHaPcn(): Promise<IENHaPcn[]> {
    try {
      return await this.ienmasterService.getHaPcn();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicant status');
    }
  }

  @ApiOperation({
    summary: `List available users`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/users')
  async getUsers(): Promise<IENUsers[]> {
    try {
      return await this.ienmasterService.getUsers();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicant status');
    }
  }

  @ApiOperation({
    summary: `List education title`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/education')
  async getEducation(): Promise<IENEducation[]> {
    try {
      return await this.ienmasterService.getEducation();
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicant status');
    }
  }
}
