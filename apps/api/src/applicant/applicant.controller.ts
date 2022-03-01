import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicantService } from './applicant.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { ApplicantEntity } from './entity/applicant.entity';
import { AppLogger } from 'src/common/logger.service';
import { ApplicantCreateAPIDTO } from './dto/applicant-create.dto';
import { ApplicantFilterByIdAPIDTO } from './dto/applicant-by-id.dto';
import { ApplicantFilterAPIDTO } from './dto/applicant-filter.dto';
import { ApplicantUpdateAPIDTO } from './dto/applicant-update.dto';

@Controller('applicant')
@ApiTags('Applicant')
export class ApplicantController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ApplicantService) private readonly applicantService: ApplicantService,
  ) {}

  @ApiOperation({
    summary: 'List applicants',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getApplicants(@Query() filter: ApplicantFilterAPIDTO): Promise<ApplicantEntity[]> {
    try {
      return await this.applicantService.getApplicants(filter);
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
    @Query() relation: ApplicantFilterByIdAPIDTO,
  ): Promise<ApplicantEntity> {
    return this.applicantService.getApplicantById(id, relation);
  }

  @ApiOperation({
    summary: 'Add Applicant',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.CREATED, type: EmptyResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async addApplicant(@Body() addApplicant: ApplicantCreateAPIDTO): Promise<ApplicantEntity> {
    try {
      return await this.applicantService.addApplicant(addApplicant);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured while adding applicant');
    }
  }

  @Patch('/:id')
  updateApplicant(
    @Param('id') id: string,
    @Body() applicantUpdate: ApplicantUpdateAPIDTO,
  ): Promise<ApplicantEntity | undefined> {
    try {
      return this.applicantService.updateApplicant(id, applicantUpdate);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured while update applicant');
    }
  }
}
