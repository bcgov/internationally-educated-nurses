import { UserGuide } from '@ien/common';
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../common/ro/success-response.ro';

export class UserGuideRO implements UserGuide {
  @ApiProperty({
    description: 'file name',
    example: 'user-guide.pdf',
  })
  name!: string;

  @ApiProperty({
    description: 'last modified date and time',
  })
  lastModified!: Date;

  @ApiProperty({
    description: 'file size in bytes',
  })
  size!: number;

  @ApiProperty({
    description: 'file version',
  })
  version!: string;
}

export class UserGuideResponse implements SuccessResponse {
  @ApiProperty({
    description: 'List of user guides',
    type: UserGuideRO,
    isArray: true,
  })
  data!: UserGuideRO[];
}
