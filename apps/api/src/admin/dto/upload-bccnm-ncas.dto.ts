import { ApiProperty } from '@nestjs/swagger';

export class UploadBccnmNcasDTO {
  @ApiProperty({
    description: `a spreadsheet of BCCNM/NCAS update`,
    type: 'file',
  })
  file!: Express.Multer.File;
}
