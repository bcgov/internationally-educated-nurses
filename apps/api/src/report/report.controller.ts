import { Controller, Get, HttpStatus, Inject, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidRoles } from '@ien/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { ReportService } from './report.service';
import { PeriodRO } from '../common/ro/period.ro';
import { AppLogger } from 'src/common/logger.service';

@Controller('reports')
@ApiTags('IEN Reports')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ReportService) private readonly reportService: ReportService) {}

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
    this.logger.log(`Report: nursing education country wise applicants requested from (${from}) and to (${to})`)
    return this.reportService.getCountryWiseApplicantList(from, to);
  }

  @ApiOperation({ summary: 'List report periods within the given time range' })
  @ApiResponse({ status: HttpStatus.OK, isArray: true, type: PeriodRO })
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
}
