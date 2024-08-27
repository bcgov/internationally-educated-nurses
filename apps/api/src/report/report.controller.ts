import { Controller, Get, Inject, Logger, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Access, ReportPeriodDTO, EmployeeRO } from '@ien/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AppLogger } from 'src/common/logger.service';
import { AllowAccess, User } from 'src/common/decorators';
import { ReportService } from './report.service';
import { ReportS3Service } from './report.s3.service';

@Controller('reports')
@ApiTags('IEN Reports')
@UseGuards(AuthGuard)
export class ReportController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(ReportService) private readonly reportService: ReportService,
    @Inject(ReportS3Service) private readonly reportS3Service: ReportS3Service,
  ) {}

  @Get('/applicant')
  @AllowAccess(Access.REPORTING)
  async getReport(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('period') period: number,
  ): Promise<object> {
    return this.reportService.getReport(from, to, period);
  }

  @ApiOperation({ summary: 'Report 1: List report periods within the given time range' })
  @Get('/applicant/registered')
  @AllowAccess(Access.REPORTING)
  async getRegisteredApplicantList(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    return this.reportService.getRegisteredApplicantList(from, to);
  }

  @ApiOperation({ summary: 'Report 2: Applicants nursing education country' })
  @Get('/applicant/education-country')
  @AllowAccess(Access.REPORTING)
  async getCountryWiseApplicantList(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    return this.reportService.getCountryWiseApplicantList(from, to);
  }

  @ApiOperation({ summary: 'Report 3: hired-withdrawn-active applicants' })
  @Get('/applicant/hired-withdrawn-active')
  @AllowAccess(Access.REPORTING)
  async getHiredWithdrawnActiveApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    const statuses = await this.reportService.getStatusMap();
    return this.reportService.getHiredWithdrawnActiveApplicants(statuses, from, to);
  }

  @ApiOperation({ summary: 'Report 4: licensing stage applicants' })
  @Get('/applicant/licensing-stage')
  @AllowAccess(Access.REPORTING)
  async getLicensingStageApplicants(
    @Query('period') period: number,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('no-cache') noCache = false,
  ): Promise<object[]> {
    // cached data relies on cron job set to run at 1AM PST
    // no-cache param is used to invalidate the cache and use current data for testing
    if (noCache || !period) {
      return this.reportService.splitReportFourNewOldProcess(from, to);
    }
    return this.reportService.getLicensingStageApplicants(period);
  }

  @ApiOperation({ summary: 'Report 5: Applicants eligible for job search' })
  @Get('/applicant/license')
  @AllowAccess(Access.REPORTING)
  async getLicenseApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    return this.reportService.getLicenseApplicants(from, to);
  }

  @ApiOperation({ summary: 'Report 6: Applicants in Recruitment stage' })
  @Get('/applicant/recruitment')
  @AllowAccess(Access.REPORTING)
  async getRecruitmentApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    const statuses = await this.reportService.getStatusMap();
    return this.reportService.getRecruitmentApplicants(statuses, from, to);
  }

  @ApiOperation({ summary: 'Report 7: Applicants in Immigration stage' })
  @Get('/applicant/immigration')
  @AllowAccess(Access.REPORTING)
  async getImmigrationApplicants(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    const statuses = await this.reportService.getStatusMap();
    return this.reportService.getImmigrationApplicants(statuses, from, to);
  }

  @ApiOperation({
    summary: 'Report 8: Number of Internationally Educated Nurse Registrants Working in BC',
  })
  @Get('/applicant/ha-current-period-fiscal')
  @AllowAccess(Access.REPORTING)
  async getApplicantHAForCurrentPeriodFiscal(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<object[]> {
    const statuses = await this.reportService.getStatusMap();
    return this.reportService.getApplicantHAForCurrentPeriodFiscal(statuses, from, to);
  }

  @ApiOperation({
    summary: 'Report 9: Average Amount of Time with Each Stakeholder Group',
  })
  @Get('/applicant/average-time-with-stakeholder-group')
  @AllowAccess(Access.REPORTING)
  async getAverageTimeWithEachStakeholderGroup(
    @Query('to') to: string,
    @Query('verbose') verbose?: boolean,
  ): Promise<object[]> {
    return await this.reportService.getReport9(to, verbose);
  }

  @ApiOperation({
    summary: 'Report 10: Average Amount of Time with Each Milestone in Stakeholder Group',
  })
  @Get('/applicant/average-time-of-milestones')
  @AllowAccess(Access.REPORTING)
  async getAverageTimeOfMilestones(
    @Query('to') to: string,
    @Query('verbose') verbose?: boolean,
  ): Promise<object[]> {
    return this.reportService.getReport10(to, verbose);
  }

  /** Additional report other than standard 9 reports */
  @ApiOperation({ summary: 'Extract applicant details' })
  @Get('/applicant/extract-data')
  @AllowAccess(Access.DATA_EXTRACT)
  async extractApplicantsData(
    @Query() { from, to }: ReportPeriodDTO,
    @User() user: EmployeeRO,
  ): Promise<object[] | { url: string }> {
    const data = await this.reportService.extractApplicantsData({ from, to }, user?.ha_pcn_id);
    if (data?.length > 10 && process.env.RUNTIME_ENV !== 'local') {
      const key = `ien-applicant-data-extract_${from}-${to}_${user?.user_id}_${Date.now()}`;
      await this.reportS3Service.uploadFile(key, data);
      return { url: await this.reportS3Service.generatePresignedUrl(key) };
    }
    return data;
  }
  @ApiOperation({ summary: 'Extract milestones' })
  @Get('/applicant/extract-milestones')
  @AllowAccess(Access.DATA_EXTRACT)
  async extractMilestoneData(
    @Query() { from, to }: ReportPeriodDTO,
    @User() user: EmployeeRO,
  ): Promise<object[] | { url: string }> {
    const data = await this.reportService.extractMilestoneData({ to, from }, user?.ha_pcn_id);
    if (data?.length > 10 && process.env.RUNTIME_ENV !== 'local') {
      const key = `ien-milestone-data-extract_${from}-${to}_${user?.user_id}_${Date.now()}`;
      await this.reportS3Service.uploadFile(key, data);
      return { url: await this.reportS3Service.generatePresignedUrl(key) };
    }
    return data;
  }
}
