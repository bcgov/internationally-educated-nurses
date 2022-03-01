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
import {
  ApplicantFilterDTO,
  ApplicantCreateDTO,
  ApplicantUpdateDTO,
  ApplicantFilterByIdDTO,
} from '@ien/common';
import { ApplicantService } from './applicant.service';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { ApplicantEntity } from './entity/applicant.entity';
import { AppLogger } from 'src/common/logger.service';

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
  async getApplicants(@Query() filterDto: ApplicantFilterDTO): Promise<ApplicantEntity[]> {
    try {
      return await this.applicantService.getApplicants(filterDto);
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
    @Query() relation: ApplicantFilterByIdDTO,
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
  async addApplicant(@Body() addApplicantDto: ApplicantCreateDTO): Promise<ApplicantEntity> {
    try {
      return await this.applicantService.addApplicant(addApplicantDto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured while adding applicant');
    }
  }

  @Patch('/:id')
  updateApplicant(
    @Param('id') id: string,
    @Body() applicantUpdate: ApplicantUpdateDTO,
  ): Promise<ApplicantEntity | undefined> {
    try {
      return this.applicantService.updateApplicant(id, applicantUpdate);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured while update applicant');
    }
  }
}
