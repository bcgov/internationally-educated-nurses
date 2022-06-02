import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestObj } from 'src/common/interface/RequestObj';
import { EmployeeEntity } from './employee.entity';
import { EmployeeService } from './employee.service';
import { AppLogger } from 'src/common/logger.service';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  constructor(
    @Inject(EmployeeService) private readonly employeeService: EmployeeService,
    @Inject(Logger) private readonly logger: AppLogger,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/:userid')
  async getEmployee(@Req() req: RequestObj): Promise<EmployeeEntity> {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('/list/all')
  async getEmployeeList(
    @Query() filter: EmployeeFilterAPIDTO,
  ): Promise<[EmployeeEntity[], number]> {
    try {
      this.logger.log(`List filtered Employee/Staff`);
      return await this.employeeService.getEmployeeList(filter);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retrieving employees');
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/update/role')
  async updateRole(@Body('ids') ids: string[], @Body('role') role: string): Promise<void> {
    this.logger.log(`Update role to (${role}) requested for user ids [${ids}]`);
    return this.employeeService.updateRole(ids, role);
  }
}
