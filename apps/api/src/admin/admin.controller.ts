import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AppLogger } from '../common/logger.service';
import { AdminService } from './admin.service';
import { UploadResponse, UserGuideResponse } from './ro';
import { Access, BccnmNcasUpdate } from '@ien/common';
import { AllowAccess } from '../common/decorators';
import { BccnmNcasUpdateDTO, UploadBccnmNcasDTO, UploadUserGuideDTO } from './dto';
import { RequestObj } from '../common/interface/RequestObj';
import { processExcelBuffer } from 'src/common/util';

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
    type: UserGuideResponse,
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
    type: UploadResponse,
  })
  @ApiConsumes('multipart/form-data')
  @AllowAccess(Access.ADMIN)
  @Post('/user-guides')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserGuide(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadUserGuideDTO,
  ) {
    return await this.service.uploadUserGuide(body.name, file);
  }

  @ApiOperation({
    summary: 'Get pre-signed url of a user guide on AWS S3',
  })
  @Get('/user-guides/:name')
  async getSignedUrl(
    @Param('name') name: string,
    @Query('version') version?: string,
  ): Promise<string> {
    return this.service.getSignedUrl(name, version);
  }

  @ApiOperation({
    summary: 'Get file versions',
  })
  @Get('/user-guides/:name/versions')
  async getUserGuideVersions(@Param('name') name: string) {
    return this.service.getVersions(name);
  }

  @ApiOperation({
    summary: 'Delete a file or its specific version',
  })
  @Delete('/user-guides/:name')
  async deleteUserGuide(@Param('name') name: string, @Query('version') version?: string) {
    return this.service.deleteUserGuide(name, version);
  }

  @ApiOperation({
    summary: 'Restore a file to a specific version',
  })
  @Patch('/user-guides/:name')
  async restoreUserGuide(@Param('name') name: string, @Query('version') version: string) {
    return this.service.restoreUserGuide(name, version);
  }

  @ApiOperation({
    summary: 'Validate BCCNM/NCAS update data',
  })
  @ApiConsumes('multipart/form-data')
  @AllowAccess(Access.ADMIN)
  @Post('/validate-bccnm-ncas-updates')
  @UseInterceptors(FileInterceptor('file'))
  async validateBccnmNcasUpdates(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadBccnmNcasDTO, // eslint-disable-line
  ) {
    const rows = await processExcelBuffer<BccnmNcasUpdate>(file.buffer);
    return await this.service.validateBccnmNcasUpdates(rows);
  }

  @ApiOperation({
    summary: 'Apply BCCNM/NCAS update data',
  })
  @AllowAccess(Access.ADMIN)
  @Post('/apply-bccnm-ncas-updates')
  async applyBccnmNcasUpdates(@Req() { user }: RequestObj, @Body() data: BccnmNcasUpdateDTO) {
    return await this.service.applyBccnmNcasUpdates(user, data);
  }
}
