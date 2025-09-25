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
  UsePipes,
  ValidationPipe,
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

  /**
   * Manual parser for job data to handle Uint8Array issues from AWS Lambda
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseJobData(rawData: any): IENApplicantJobCreateUpdateAPIDTO {
    if (!rawData || typeof rawData !== 'object') {
      throw new BadRequestException('Invalid job data');
    }

    // Manual validation and parsing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jobData: any = {};

    // ha_pcn - required string
    if (!rawData.ha_pcn || typeof rawData.ha_pcn !== 'string') {
      throw new BadRequestException('HA/PCN is required and must be a string');
    }
    jobData.ha_pcn = rawData.ha_pcn;

    // job_id - optional string
    if (rawData.job_id !== undefined) {
      if (typeof rawData.job_id !== 'string') {
        throw new BadRequestException('Job ID must be a string');
      }
      jobData.job_id = rawData.job_id;
    }

    // job_title - optional string
    if (rawData.job_title !== undefined) {
      if (typeof rawData.job_title !== 'string') {
        throw new BadRequestException('Job title must be a string');
      }
      jobData.job_title = rawData.job_title;
    }

    // job_location - required array of numbers (this is where Uint8Array issues happen)
    if (!rawData.job_location) {
      throw new BadRequestException('Job location is required');
    }

    let jobLocation: number[] = [];
    if (rawData.job_location instanceof Uint8Array) {
      // Convert Uint8Array to regular array
      jobLocation = Array.from(rawData.job_location);
    } else if (Array.isArray(rawData.job_location)) {
      jobLocation = rawData.job_location;
    } else {
      throw new BadRequestException('Job location must be an array');
    }

    // Validate that all elements are numbers
    if (jobLocation.length === 0) {
      throw new BadRequestException('At least one community is required');
    }
    
    if (!jobLocation.every(item => typeof item === 'number' && Number.isInteger(item))) {
      throw new BadRequestException('Job location must be an array of integers');
    }
    
    jobData.job_location = jobLocation;

    // job_post_date - optional date string
    if (rawData.job_post_date !== undefined && rawData.job_post_date !== '') {
      if (typeof rawData.job_post_date !== 'string') {
        throw new BadRequestException('Job post date must be a string');
      }
      // Basic date validation
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(rawData.job_post_date)) {
        throw new BadRequestException('Job post date must be in YYYY-MM-DD format');
      }
      jobData.job_post_date = rawData.job_post_date;
    }

    return jobData as IENApplicantJobCreateUpdateAPIDTO;
  }

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
      throw new InternalServerErrorException('An unknown error occurred retrieving applicants');
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
    @Req() req: RequestObj,
    @Param('id') id: string,
    @Query() relation: IENApplicantFilterByIdAPIDTO,
  ): Promise<ApplicantRO> {
    try {
      return (
        await this.ienapplicantService.getApplicantById(id, relation, req.user)
      ).toResponseObject();
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
        throw new InternalServerErrorException('An unknown error occurred while adding applicant');
      }
    }
  }

  @ApiOperation({
    summary: 'Update applicant active/ inactive flag',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAccess(Access.APPLICANT_WRITE)
  @Patch('/:id/active')
  async updateApplicantActiveFlag(
    @Req() { user }: RequestObj,
    @Param('id') id: string,
    @Body() body: { activeFlag: boolean },
  ): Promise<ApplicantRO> {
    try {
      const { activeFlag } = body;
      return await this.ienapplicantService.updateApplicantActiveFlag(user, id, activeFlag);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof NotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new BadRequestException(e);
      } else {
        // statements to handle any unspecified exceptions
        throw new InternalServerErrorException(
          'An unknown error occurred while updating applicant active flag',
        );
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
    summary: 'Assign applicant to me(logged-in user)',
  })
  @Post('/:id/assign')
  @AllowAccess(Access.APPLICANT_WRITE)
  async assignApplicant(@Req() { user }: RequestObj, @Param('id') id: string): Promise<void> {
    await this.ienapplicantService.assignApplicant(id, user);
  }

  @ApiOperation({
    summary: 'Add applicant job record',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @AllowAccess(Access.APPLICANT_WRITE)
  @UsePipes(new ValidationPipe({ transform: false, whitelist: false, skipMissingProperties: true }))
  @Post('/:id/job')
  async addApplicantJob(
    @Req() req: RequestObj,
    @Param('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() rawJobData: any,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      this.logger.log(`Add job competition for the applicant ${id}`);

      // Manually parse and validate the job data to handle Uint8Array issues
      const jobData = this.parseJobData(rawJobData);

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
          'An unknown error occurred while adding applicant job',
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
  @UsePipes(new ValidationPipe({ transform: false, whitelist: false, skipMissingProperties: true }))
  async updateApplicantJob(
    @Param('id') id: string,
    @Param('job_id') job_id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() rawJobData: any,
  ): Promise<ApplicantJobRO | undefined> {
    try {
      this.logger.log(`Update job competition (${job_id}) for the applicant ${id}`);

      // Manually parse and validate the job data to handle Uint8Array issues
      const jobData = this.parseJobData(rawJobData);

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
          'An unknown error occurred while adding applicant job',
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
        throw new InternalServerErrorException('An unknown error occurred while fetching ');
      }
    }
  }

  _handleStatusException(e: unknown) {
    this.logger.error(e);
    if (e instanceof NotFoundException) {
      return e;
    } else if (e instanceof QueryFailedError) {
      if (e.message.includes('duplicate')) {
        return new BadRequestException(`Duplicate milestone with same date found!`);
      }
      throw new BadRequestException(e.message);
    } else if (e instanceof BadRequestException) {
      return e;
    } else {
      // statements to handle any unspecified exceptions
      return new InternalServerErrorException(
        `An unknown error occured while updating applicant's status`,
      );
    }
  }

  @ApiOperation({
    summary: 'Delete applicant (scramble PII and keep milestones)',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/:id')
  @AllowAccess(Access.APPLICANT_WRITE, Access.ADMIN)
  async deleteApplicant(@Req() req: RequestObj, @Param('id') id: string): Promise<void> {
    try {
      this.logger.log(
        `Delete applicant (${id}) requested by
        userId (${req?.user.user_id})/ employeeId/loginId (${req?.user.id})`,
      );
      return this.ienapplicantService.deleteApplicant(req?.user.id, id);
    } catch (e) {
      throw this._handleStatusException(e);
    }
  }
}
