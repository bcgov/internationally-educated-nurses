import { ServerResponse } from 'http';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AppLogger } from '../common/logger.service';
import { AdminService } from './admin.service';
import { UserGuideRO } from './ro/user-guide.ro';
import { Access } from '@ien/common';
import { AllowAccess } from '../common/decorators';
import { UploadRO } from './ro/upload.ro';
import { UploadDTO } from './dto/upload.dto';

@Controller('admin')
@ApiTags('IEN Admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @Inject(AdminService) private readonly service: AdminService,
  ) {}

  @ApiOperation({
    summary: 'Get list of user guide pdf files',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserGuideRO,
    isArray: true,
  })
  @Get('/user-guides')
  async getUserGuides() {
    return await this.service.getUserGuides();
  }

  @ApiOperation({
    summary: 'Upload a user guide of pdf format.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UploadRO,
  })
  @AllowAccess(Access.ADMIN)
  @Post('/user-guides')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserGuide(@UploadedFile() file: Express.Multer.File, @Body() body: UploadDTO) {
    return await this.service.uploadUserGuide(body.name, file);
  }

  @ApiOperation({
    summary: 'Download a user guide',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StreamableFile,
  })
  @Get('/user-guides/:name')
  @Header('Content-Type', 'application/pdf')
  async getUserGuide(@Param('name') name: string, @Res() res: ServerResponse) {
    res.setHeader('Content-Disposition', `attachment; filename=${name}`);
    const stream = this.service.getUserGuideStream(name);
    stream.pipe(res);
  }
}
