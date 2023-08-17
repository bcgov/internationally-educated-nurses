import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UploadBccnmNcasDTO {
  @ApiModelProperty({
    description: `a spreadsheet of BCCNM/NCAS update`,
    type: 'file',
  })
  file!: Express.Multer.File;
}
