import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class UploadRO {
  @ApiModelProperty({
    description: 'Location URL',
    example: 'https://ien.s3.ca-central-1.amazonaws.com/user-guide.pdf',
  })
  location!: string;
}
