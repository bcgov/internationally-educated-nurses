import { IsString, Matches, MaxLength } from 'class-validator';
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
  @MaxLength(255)
  @Matches(/^[a-zA-Z0-9]([a-zA-Z0-9._-])*[a-zA-Z0-9]$/, {
    message: 'File name must contain only alphanumeric characters, dots, hyphens, and underscores',
  })
  name!: string;
}
