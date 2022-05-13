import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from 'src/auth/auth.constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { ReportService } from './report.service';

@Controller('reports')
@ApiTags('IEN Reports')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(@Inject(ReportService) private readonly reportService: ReportService) {}

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
    return this.reportService.getCountryWiseApplicantList(from, to);
  }

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
    return this.reportService.getRegisteredApplicantList(from, to);
  }
}
