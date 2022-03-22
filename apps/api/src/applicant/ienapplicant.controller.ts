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
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IENApplicantService } from './ienapplicant.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AppLogger } from 'src/common/logger.service';
import { IENApplicant } from './entity/ienapplicant.entity';
import { IENApplicantCreateAPIDTO } from './dto/ienapplicant-create.dto';
import { IENApplicantFilterByIdAPIDTO } from './dto/ienapplicant-by-id.dto';
import { IENApplicantUpdateAPIDTO } from './dto/ienapplicant-update.dto';
import { IENApplicantAddStatusAPIDTO } from './dto/ienapplicant-add-status.dto';
import { IENApplicantFilterAPIDTO } from './dto/ienapplicant-filter.dto';
import { QueryFailedError } from 'typeorm';
import { IENApplicantUpdateStatusAPIDTO } from './dto/ienapplicant-update-status.dto';
import { IENApplicantStatusAudit } from './entity/ienapplicant-status-audit.entity';
import { IENApplicantJobCreateUpdateAPIDTO } from './dto/ienapplicant-job-create.dto';
import { IENApplicantJob } from './entity/ienjob.entity';

@Controller('ien')
@ApiTags('IEN Applicant')
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
  @Get('/')
  async getApplicants(@Query() filter: IENApplicantFilterAPIDTO): Promise<IENApplicant[]> {
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
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getApplicant(
    @Param('id') id: string,
    @Query() relation: IENApplicantFilterByIdAPIDTO,
  ): Promise<IENApplicant> {
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
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async addApplicant(@Body() addApplicant: IENApplicantCreateAPIDTO): Promise<IENApplicant> {
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
  @Patch('/:id')
  updateApplicant(
    @Param('id') id: string,
    @Body() applicantUpdate: IENApplicantUpdateAPIDTO,
  ): Promise<IENApplicant | undefined> {
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
  @Post('/:id/status')
  addApplicantStatus(
    @Param('id') id: string,
    @Body() applicantStatus: IENApplicantAddStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | undefined> {
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
  updateApplicantStatus(
    @Param('id') id: string,
    @Param('status_id') status_id: string,
    @Body() applicantStatus: IENApplicantUpdateStatusAPIDTO,
  ): Promise<IENApplicantStatusAudit | undefined> {
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
  @Post('/:id/job')
  addApplicantJob(
    @Param('id') id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
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
  updateApplicantJob(
    @Param('id') id: string,
    @Param('job_applicant_id') job_applicant_id: string,
    @Body() jobData: IENApplicantJobCreateUpdateAPIDTO,
  ): Promise<IENApplicantJob | undefined> {
    try {
      return this.ienapplicantService.updateApplicantJob(job_applicant_id, jobData);
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
  @Get('/:id/jobs')
  getApplicantJobs(@Param('id') id: string): Promise<IENApplicantJob[]> {
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
