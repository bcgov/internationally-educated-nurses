import { ApiProperty } from '@nestjs/swagger';

export class UploadBccnmNcasDTO {
  @ApiProperty({
    description: `a spreadsheet of BCCNM/NCAS update`,
    type: 'string',
    format: 'binary',
  })
  file!: Express.Multer.File;
}
