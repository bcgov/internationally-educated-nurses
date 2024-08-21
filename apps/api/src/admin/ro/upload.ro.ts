import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../common/ro/success-response.ro';

export class UploadRO {
  @ApiProperty({
    description: 'Location URL',
    example: 'https://ien.s3.ca-central-1.amazonaws.com/user-guide.pdf',
  })
  location!: string;
}

export class UploadResponse implements SuccessResponse {
  @ApiProperty({
    description: 'Response data',
    type: UploadRO,
  })
  data!: UploadRO;
}
