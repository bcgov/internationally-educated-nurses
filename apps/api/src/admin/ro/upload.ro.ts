import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { SuccessResponse } from '../../common/ro/success-response.ro';

export class UploadRO {
  @ApiModelProperty({
    description: 'Location URL',
    example: 'https://ien.s3.ca-central-1.amazonaws.com/user-guide.pdf',
  })
  location!: string;
}

export class UploadResponse implements SuccessResponse {
  @ApiModelProperty({
    description: 'Response data',
    type: UploadRO,
  })
  data!: UploadRO;
}
