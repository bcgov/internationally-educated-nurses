import { EmployeeExternalAPIService } from './employee-external-api.service';
import { AppLogger } from 'src/common/logger.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmptyResponse } from 'src/common/ro/empty-response.ro';
import { AuthGuard } from '@nestjs/passport';

@Controller('ext-employee-api')
@ApiTags('External API data process for Employees')
export class EmployeeExternalAPIController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(EmployeeExternalAPIService)
    private readonly employeeExternalAPIService: EmployeeExternalAPIService,
  ) {}

  @ApiOperation({
    summary: `Get Employee data whose role is NOT Pending`,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ status: HttpStatus.OK, type: EmptyResponse })
  @HttpCode(HttpStatus.OK)
  @Get('/sync-employee-data')
  @UseGuards(AuthGuard('api-key'))
  async getEmployeeData(): Promise<unknown> {
    try {
      return await this.employeeExternalAPIService.getEmployeeData();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
