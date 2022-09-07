import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { Access, ApplicantJobRO, ApplicantRO, ApplicantStatusAuditRO } from '@ien/common';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AllowAccess } from 'src/common/decorators';
import { RequestObj } from 'src/common/interface/RequestObj';
import { IENApplicantService } from './ienapplicant.service';
import {
  IENApplicantAddStatusAPIDTO,
  IENApplicantCreateUpdateAPIDTO,
  IENApplicantFilterByIdAPIDTO,
  IENApplicantJobCreateUpdateAPIDTO,
  IENApplicantJobQueryDTO,
  IENApplicantUpdateStatusAPIDTO,
} from './dto';

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
  @HttpCode(HttpStatus.OK)
  @AllowAccess(Access.APPLICANT_READ)
  @Get('/')
  async getApplicants(
    @Req() req: RequestObj,
    @Query() filter: IENApplicantFilterAPIDTO,
  ): Promise<[ApplicantRO[], number]> {
    try {
      const [data, count] = await this.ienapplicantService.getApplicants(filter, req.user);
      return [data?.map(applicant => applicant.toResponseObject()), count];
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
  @HttpCode(HttpStatus.OK)
  @AllowAccess(Access.APPLICANT_READ)
  @Get('/:id')
  async getApplicant(
    @Param('id') id: string,
    @Query() relation: IENApplicantFilterByIdAPIDTO,
  ): Promise<ApplicantRO> {
    try {
      return (await this.ienapplicantService.getApplicantById(id, relation)).toResponseObject();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occurred while getting applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Add Applicant',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @AllowAccess(Access.APPLICANT_WRITE)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async addApplicant(
    @Req() req: RequestObj,
    @Body() addApplicant: IENApplicantCreateUpdateAPIDTO,
  ): Promise<ApplicantRO> {
    try {
      return await this.ienapplicantService.addApplicant(addApplicant, req.user);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException('An unknown error occurred while adding applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Update applicant information',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAccess(Access.APPLICANT_WRITE)
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
  @AllowAccess(Access.APPLICANT_WRITE)
  @Post('/:id/status')
  async addApplicantStatus(
    @Req() req: RequestObj,
    @Param('id') id: string,
    @Body() applicantStatus: IENApplicantAddStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      this.logger.log(
        `Add milestone/status for applicant (${id}) requested by
        userId (${req?.user?.user_id})/ employeeId/loginId (${req?.user?.id})`,
      );
      return await this.ienapplicantService.addApplicantStatus(req?.user, id, applicantStatus);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Update applicant milestone/status',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/:id/status/:status_id')
  @AllowAccess(Access.APPLICANT_WRITE)
  async updateApplicantStatus(
    @Req() req: RequestObj,
    @Param('id') _id: string,
    @Param('status_id') status_id: string,
    @Body() applicantStatus: IENApplicantUpdateStatusAPIDTO,
  ): Promise<ApplicantStatusAuditRO | undefined> {
    try {
      this.logger.log(
        `Update milestone/status (${status_id}) on applicant (${_id}) requested by
        userId (${req?.user.user_id})/ employeeId/loginId (${req?.user.id})`,
      );
      return await this.ienapplicantService.updateApplicantStatus(
        req?.user,
        status_id,
        applicantStatus,
      );
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Delete applicant milestone/status',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id/status/:status_id')
  @AllowAccess(Access.APPLICANT_WRITE)
  async deleteApplicantStatus(
    @Req() req: RequestObj,
    @Param('id') _id: string,
    @Param('status_id') status_id: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `Delete milestone/status (${status_id}) on applicant (${_id}) requested by
        userId (${req?.user.user_id})/ employeeId/loginId (${req?.user.id})`,
      );
      return this.ienapplicantService.deleteApplicantStatus(req?.user.user_id, status_id);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Add applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAccess(Access.APPLICANT_WRITE)
  @Post('/:id/job')
  async addApplicantJob(
    @Req() req: RequestObj,
    @Param('id') id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      this.logger.log(`Add job competition for the applicant ${id}`);
      return (
        await this.ienapplicantService.addApplicantJob(req.user, id, jobData)
      )?.toResponseObject();
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
  @AllowAccess(Access.APPLICANT_READ)
  async getJob(@Param('job_id') job_id: string): Promise<ApplicantJobRO | undefined> {
    return (await this.ienapplicantService.getApplicantJob(job_id))?.toResponseObject();
  }

  @ApiOperation({
    summary: 'Update applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id/job/:job_id')
  @AllowAccess(Access.APPLICANT_WRITE)
  async updateApplicantJob(
    @Param('id') id: string,
    @Param('job_id') job_id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      this.logger.log(`Update job competition (${job_id}) for the applicant ${id}`);
      return (
        await this.ienapplicantService.updateApplicantJob(id, job_id, jobData)
      )?.toResponseObject();
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
    summary: 'Delete applicant job and all related milestone/status',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id/job/:job_id')
  @AllowAccess(Access.APPLICANT_WRITE)
  async deleteApplicantJob(
    @Req() req: RequestObj,
    @Param('id') _id: string,
    @Param('job_id') job_id: string,
  ): Promise<void> {
    try {
      this.logger.log(
        `Delete job (${job_id}) on applicant (${_id}) requested by
        userId (${req?.user.user_id})/ employeeId/loginId (${req?.user.id})`,
      );
      return this.ienapplicantService.deleteApplicantJob(req?.user.user_id, job_id);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }

  @ApiOperation({
    summary: 'Get Applicant jobs and related milestone',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @AllowAccess(Access.APPLICANT_READ)
  @Get('/:id/jobs')
  async getApplicantJobs(
    @Param('id') id: string,
    @Query() options: IENApplicantJobQueryDTO,
  ): Promise<[ApplicantJobRO[], number]> {
    try {
      this.logger.log(`Fetch job competition for the applicant ${id} with below options/filter`);
      const [data, count] = await this.ienapplicantService.getApplicantJobs(id, options);
      return [data?.map(job => job.toResponseObject()), count];
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
