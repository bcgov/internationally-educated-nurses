import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UploadDTO {
  @ApiModelProperty({
    description: 'a user guide of pdf format',
    type: 'file',
  })
  file!: Express.Multer.File;

  @ApiModelProperty({
    description: 'key name for the AWS S3 object',
    example: 'user-guide.pdf',
  })
  @IsString()
  name!: string;
}
