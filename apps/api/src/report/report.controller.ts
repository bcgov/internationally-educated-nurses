import { Controller, Get, Inject, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidRoles } from '@ien/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { ReportService } from './report.service';
import { AppLogger } from 'src/common/logger.service';

@Controller('reports')
@ApiTags('IEN Reports')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ReportService) private readonly reportService: ReportService,
  ) {}

  @ApiOperation({ summary: 'Report 2: Applicants nursing education country' })
  @Get('/applicant/education-country')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getCountryWiseApplicantList(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(
      `Report: nursing education country wise applicants requested from (${from}) and to (${to})`,
    );
    return this.reportService.getCountryWiseApplicantList(from, to);
  }

  @ApiOperation({ summary: 'Report 1: List report periods within the given time range' })
  @Get('/applicant/registered')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getRegisteredApplicantList(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(`Report: registered applicants requested from (${from}) and to (${to})`);
    return this.reportService.getRegisteredApplicantList(from, to);
  }

  @ApiOperation({ summary: 'Report 3: hired-withdrawn-active applicants' })
  @Get('/applicant/hired-withdrawn-active')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getHiredWithdrawnActiveApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(
      `Report: Applicants count of Active, Withdrawn and Hired (from ${from} to ${to})`,
    );
    return this.reportService.getHiredWithdrawnActiveCount(from, to);
  }

  @ApiOperation({ summary: 'Report 4: licensing stage applicants' })
  @Get('/applicant/licensing-stage')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getLicensingStageApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(`Report: Licensing Stage Applicants (from ${from} to ${to})`);
    return this.reportService.getLicensingStageApplicants(from, to);
  }

  @ApiOperation({ summary: 'Report 5: Applicants eligible for job search' })
  @Get('/applicant/license')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getLicenseApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(`Report: Applicants eligible for job search (from ${from} to ${to})`);
    return this.reportService.getLicenseApplicants(from, to);
  }

  @ApiOperation({ summary: 'Report 6: Applicants in Recruitment stage' })
  @Get('/applicant/recruitment')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getRecruitmentApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(`Report: Applicants in Recruitment stage (from ${from} to ${to})`);
    return this.reportService.getRecruitmentApplicants(from, to);
  }

  @ApiOperation({ summary: 'Report 7: Applicants in Immigration stage' })
  @Get('/applicant/immigration')
  @RouteAcceptsRoles(
    ValidRoles.HEALTH_AUTHORITY,
    ValidRoles.HEALTH_MATCH,
    ValidRoles.MINISTRY_OF_HEALTH,
  )
  async getImmigrationApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    this.logger.log(`Report: Applicants in Immigration stage (from ${from} to ${to})`);
    return this.reportService.getImmigrationApplicants(from, to);
  }
}
