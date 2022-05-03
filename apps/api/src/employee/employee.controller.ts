import { Body, Controller, Get, Inject, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from 'src/auth/auth.constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { RouteAcceptsRoles } from 'src/common/decorators';
import { RequestObj } from 'src/common/interface/RequestObj';
import { EmployeeEntity } from './employee.entity';
import { EmployeeService } from './employee.service';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  constructor(@Inject(EmployeeService) private readonly employeeService: EmployeeService) {}
  @Get('/:userid')
  async getEmployee(@Req() req: RequestObj): Promise<EmployeeEntity> {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @RouteAcceptsRoles(ValidRoles.ROLEADMIN)
  @Get('/list/all')
  async getEmployeeList(@Query('name') name: string): Promise<EmployeeEntity[]> {
    return await this.employeeService.getEmployeeList(name);
  }

  @UseGuards(AuthGuard)
  @RouteAcceptsRoles(ValidRoles.ROLEADMIN, ValidRoles.MINISTRY_OF_HEALTH)
  @Patch('/update/role')
  async updateRole(@Body('ids') ids: string[], @Body('role') role: string): Promise<void> {
    return await this.employeeService.updateRole(ids, role);
  }
}
