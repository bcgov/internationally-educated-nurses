import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadUserGuideDTO {
  @ApiProperty({
    description: 'a user guide of pdf format',
    type: 'string',
    format: 'binary',
  })
  file!: Express.Multer.File;

  @ApiProperty({
    description: 'key name for the AWS S3 object',
    example: 'user-guide.pdf',
  })
  @IsString()
  name!: string;
}
