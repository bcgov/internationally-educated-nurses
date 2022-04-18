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
  getApplicant(
    @Param('id') id: string,
    @Query() relation: IENApplicantFilterByIdAPIDTO,
  ): Promise<ApplicantRO> {
    try {
      return this.ienapplicantService.getApplicantById(id, relation);
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
  updateApplicant(
    @Param('id') id: string,
    @Body() applicantUpdate: IENApplicantCreateUpdateAPIDTO,
  ): Promise<ApplicantRO | undefined> {
    try {
      return this.ienapplicantService.updateApplicantInfo(id, applicantUpdate);
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
  addApplicantStatus(
    @Param('id') id: string,
    @Body() applicantStatus: IENApplicantAddStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      return this.ienapplicantService.addApplicantStatus(id, applicantStatus);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while adding applicant status',
        );
      }
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
  updateApplicantStatus(
    @Param('id') id: string,
    @Param('status_id') status_id: string,
    @Body() applicantStatus: IENApplicantUpdateStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      return this.ienapplicantService.updateApplicantStatus(status_id, applicantStatus);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while update applicant status',
        );
      }
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
  addApplicantJob(
    @Param('id') id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      return this.ienapplicantService.addApplicantJob(id, jobData);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occured while adding applicant job',
        );
      }
    }
  }

  @ApiOperation({
    summary: 'Update applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id/job/:job_applicant_id')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  updateApplicantJob(
    @Param('id') id: string,
    @Param('job_applicant_id') job_applicant_id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      return this.ienapplicantService.updateApplicantJob(id, job_applicant_id, jobData);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
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
  getApplicantJobs(@Param('id') id: string): Promise<ApplicantJobRO[]> {
    try {
      return this.ienapplicantService.getApplicantJobs(id);
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
}
