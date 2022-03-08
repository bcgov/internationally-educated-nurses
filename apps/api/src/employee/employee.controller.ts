import { Controller, Get, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeEntity } from './employee.entity';
import { EmployeeService } from './employee.service';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get('/:userid')
  async getEmployee(@Param('userid') userId: string, @Res() res: any): Promise<EmployeeEntity> {
    return res.send(res.locals.user).status(HttpStatus.OK);
  }
}
