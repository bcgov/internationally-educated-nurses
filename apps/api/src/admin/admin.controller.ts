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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AppLogger } from '../common/logger.service';
import { AdminService } from './admin.service';
import {
  BccnmNcasValidationResponse,
  SignedUrlResponse,
  UploadResponse,
  UserGuideResponse,
} from './ro';
import { Access } from '@ien/common';
import { AllowAccess } from '../common/decorators';
import { UploadDTO } from './dto/upload.dto';
import { EmptyResponse } from '../common/ro/empty-response.ro';

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
  async uploadUserGuide(@UploadedFile() file: Express.Multer.File, @Body() body: UploadDTO) {
    return await this.service.uploadUserGuide(body.name, file);
  }

  @ApiOperation({
    summary: 'Get pre-signed url of a user guide',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignedUrlResponse,
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserGuideResponse,
  })
  @Get('/user-guides/:name/versions')
  async getUserGuideVersions(@Param('name') name: string) {
    return this.service.getVersions(name);
  }

  @ApiOperation({
    summary: 'Delete a file or its specific version',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponse,
  })
  @Delete('/user-guides/:name')
  async deleteUserGuide(@Param('name') name: string, @Query('version') version?: string) {
    return this.service.deleteUserGuide(name, version);
  }

  @ApiOperation({
    summary: 'Restore a file to a specific version',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: EmptyResponse,
  })
  @Patch('/user-guides/:name')
  async restoreUserGuide(@Param('name') name: string, @Query('version') version: string) {
    return this.service.restoreUserGuide(name, version);
  }

  @ApiOperation({
    summary: 'Validate BCCNM/NCAS update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BccnmNcasValidationResponse,
  })
  @ApiConsumes('multipart/form-data')
  @AllowAccess(Access.ADMIN)
  @Post('/validate-bccnm-ncas-updates')
  @UseInterceptors(FileInterceptor('file'))
  async validateBccnmNcasUpdates(@UploadedFile() file: Express.Multer.File) {
    return await this.service.validateBccnmNcasUpdates(file);
  }
}
