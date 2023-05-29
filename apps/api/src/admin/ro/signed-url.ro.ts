import { ApiProperty } from '@nestjs/swagger';

export class SignedUrlResponse {
  @ApiProperty({ description: 'Pre-signed URL of a user guide pdf' })
  data?: string;
}
