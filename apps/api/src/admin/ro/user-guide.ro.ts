import { UserGuide } from '@ien/common';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { SuccessResponse } from '../../common/ro/success-response.ro';

export class UserGuideRO implements UserGuide {
  @ApiModelProperty({
    description: 'file name',
    example: 'user-guide.pdf',
  })
  name!: string;

  @ApiModelProperty({
    description: 'last modified date and time',
  })
  lastModified!: Date;

  @ApiModelProperty({
    description: 'file size in bytes',
  })
  size!: number;

  @ApiModelProperty({
    description: 'file version',
  })
  version!: string;
}

export class UserGuideResponse implements SuccessResponse {
  @ApiModelProperty({
    description: 'Response data',
    type: UserGuideRO,
    isArray: true,
  })
  data!: UserGuideRO[];
}
