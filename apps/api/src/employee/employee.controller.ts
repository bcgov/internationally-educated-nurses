import { EmployeeFilterAPIDTO } from './dto/employee-filter.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestObj } from 'src/common/interface/RequestObj';
import { EmployeeEntity } from './entity/employee.entity';
import { EmployeeService } from './employee.service';
import { AppLogger } from 'src/common/logger.service';
import { RoleEntity } from './entity/role.entity';
import { EmployeeRO } from '@ien/common';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  constructor(
    @Inject(EmployeeService) private readonly employeeService: EmployeeService,
    @Inject(Logger) private readonly logger: AppLogger,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getEmployee(@Req() req: RequestObj, @Query('id') id: string): Promise<EmployeeRO> {
    if (!id) return req.user;

    const employee = await this.employeeService.getEmployee(id);
    if (!employee) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    return employee;
  }

  /**
   * Query employees.
   * @param filter
   */
  @UseGuards(AuthGuard)
  @Get('/list/all')
  async getEmployeeList(
    @Query() filter: EmployeeFilterAPIDTO,
  ): Promise<[EmployeeEntity[], number]> {
    try {
      return await this.employeeService.getEmployeeList(filter);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('An unknown error occured retrieving employees');
    }
  }

  /**
   * Get all available roles.
   */
  @UseGuards(AuthGuard)
  @Get('/list/roles')
  async getRoles(): Promise<RoleEntity[]> {
    return this.employeeService.getRoles();
  }

  /**
   * Update employee's roles.
   * @param id employee's id
   * @param role_ids list of role id
   */
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'employee id',
        },
        role_ids: {
          type: 'array',
          items: { type: 'number' },
          description: 'list of role id',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @Patch('/update/role')
  async updateRoles(
    @Body('id') id: string,
    @Body('role_ids') role_ids: number[],
  ): Promise<EmployeeEntity> {
    return this.employeeService.updateRoles(id, role_ids);
  }

  /**
   * Revoke employee user access.
   * @param id employee's id
   */
  @ApiBody({
    schema: { type: 'object', properties: { id: { type: 'string', description: 'employee id' } } },
  })
  @UseGuards(AuthGuard)
  @Patch('/revoke')
  async revokeAccess(@Body('id') id: string): Promise<EmployeeEntity> {
    return this.employeeService.revokeAccess(id);
  }

  /**
   * Activate a revoked employee user.
   * @param id employee's id
   */
  @ApiBody({
    schema: { type: 'object', properties: { id: { type: 'string', description: 'employee id' } } },
  })
  @UseGuards(AuthGuard)
  @Patch('/activate')
  async activate(@Body('id') id: string): Promise<EmployeeEntity> {
    return this.employeeService.activate(id);
  }
}
