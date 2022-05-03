import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IENApplicantService } from './ienapplicant.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantCreateUpdateAPIDTO } from './dto/ienapplicant-create.dto';
import { IENApplicantFilterByIdAPIDTO } from './dto/ienapplicant-by-id.dto';
import { IENApplicantAddStatusAPIDTO } from './dto/ienapplicant-add-status.dto';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { QueryFailedError } from 'typeorm';
import { IENApplicantUpdateStatusAPIDTO } from './dto/ienapplicant-update-status.dto';
import { IENApplicantJobCreateUpdateAPIDTO } from './dto/ienapplicant-job-create.dto';
import { ApplicantJobRO, ApplicantRO, ApplicantStatusAuditRO } from '@ien/common';
import { ValidRoles } from 'src/auth/auth.constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { IENApplicantJobQueryDTO } from './dto/ienapplicant-job-filter.dto';

@Controller('ien')
@ApiTags('IEN Applicant')
@UseGuards(AuthGuard)
export class IENApplicantController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(IENApplicantService) private readonly ienapplicantService: IENApplicantService,
  ) {}

  @ApiOperation({
    summary: 'List applicants',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getApplicants(@Query() filter: IENApplicantFilterAPIDTO): Promise<[ApplicantRO[], number]> {
    try {
      return await this.ienapplicantService.getApplicants(filter);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retriving applicants');
    }
  }

  @ApiOperation({
    summary: 'Get Applicant details',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getApplicant(
    @Param('id') id: string,
    @Query() relation: IENApplicantFilterByIdAPIDTO,
  ): Promise<ApplicantRO> {
    try {
      return await this.ienapplicantService.getApplicantById(id, relation);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occured while adding applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Add Applicant',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async addApplicant(@Body() addApplicant: IENApplicantCreateUpdateAPIDTO): Promise<ApplicantRO> {
    try {
      return await this.ienapplicantService.addApplicant(addApplicant);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occured while adding applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Update applicant information',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @Patch('/:id')
  async updateApplicant(
    @Param('id') id: string,
    @Body() applicantUpdate: IENApplicantCreateUpdateAPIDTO,
  ): Promise<ApplicantRO | undefined> {
    try {
      return await this.ienapplicantService.updateApplicantInfo(id, applicantUpdate);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occured while adding applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Add applicant milestone/status',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @Post('/:id/status')
  async addApplicantStatus(
    @Param('id') id: string,
    @Body() applicantStatus: IENApplicantAddStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      return await this.ienapplicantService.addApplicantStatus(id, applicantStatus);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Update applicant milestone/status',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id/status/:status_id')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async updateApplicantStatus(
    @Param('id') _id: string,
    @Param('status_id') status_id: string,
    @Body() applicantStatus: IENApplicantUpdateStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      return await this.ienapplicantService.updateApplicantStatus(status_id, applicantStatus);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Add applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @Post('/:id/job')
  async addApplicantJob(
    @Param('id') id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      return await this.ienapplicantService.addApplicantJob(id, jobData);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else if (e instanceof BadRequestException) {
        throw e;
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while adding applicant job',
        );
      }
    }
  }

  @ApiOperation({
    summary: 'Get applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/job/:job_id')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getJob(@Param('job_id') job_id: string): Promise<ApplicantJobRO | undefined> {
    return this.ienapplicantService.getApplicantJob(job_id);
  }

  @ApiOperation({
    summary: 'Update applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id/job/:job_id')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async updateApplicantJob(
    @Param('id') id: string,
    @Param('job_id') job_id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      return await this.ienapplicantService.updateApplicantJob(id, job_id, jobData);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else if (e instanceof BadRequestException) {
        throw e;
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while adding applicant job',
        );
      }
    }
  }

  @ApiOperation({
    summary: 'Get Applicant jobs and related milestone',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  @Get('/:id/jobs')
  async getApplicantJobs(
    @Param('id') id: string,
    @Query() options: IENApplicantJobQueryDTO,
  ): Promise<[ApplicantJobRO[], number]> {
    try {
      return await this.ienapplicantService.getApplicantJobs(id, options);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occured while fetching ');
      }
    }
  }

  _handleStatusException(e: unknown) {
    this.logger.error(e);
    if (e instanceof NotFoundException) {
      return e;
    } else if (e instanceof QueryFailedError) {
      if (e.message.indexOf('duplicate') !== -1) {
        return new BadRequestException(`Duplicate milestone with same date found!`);
      }
      throw new BadRequestException(e.message);
    } else if (e instanceof BadRequestException) {
      return e;
    } else {
      // statements to handle any unspecified exceptions
      return new InternalServerErrorException(
        'An unknown error occured while update applicant status',
      );
    }
  }
}
