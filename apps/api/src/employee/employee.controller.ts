import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeEntity } from './employee.entity';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  @Get('/:userid')
  async getEmployee(@Res() res: any): Promise<EmployeeEntity> {
    return res.send(res.locals.user).status(HttpStatus.OK);
  }
}
