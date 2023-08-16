import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { SuccessResponse } from '../../common/ro/success-response.ro';
import { BccnmNcasValidation } from '@ien/common';

export class BccnmNcasValidationRO implements BccnmNcasValidation {
  @ApiModelProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  'HMBC Unique ID'!: string;

  @ApiModelProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  'Date ROS Contract Signed'!: string;

  @ApiModelProperty({
    description: 'First Name',
  })
  ['First Name']!: string;

  @ApiModelProperty({
    description: 'Last Name',
  })
  ['Last Name']!: string;

  @ApiModelProperty({
    description: 'Email',
  })
  Email!: string;

  @ApiModelProperty({
    description: 'Validation result of ROS',
  })
  message!: string;

  @ApiModelProperty({
    description: '',
  })
  valid!: boolean;
}

export class BccnmNcasValidationResponse implements SuccessResponse {
  @ApiModelProperty({
    description: 'List of BCCNM/NCAS update validation',
    type: BccnmNcasValidationRO,
    isArray: true,
  })
  data!: BccnmNcasValidationRO[];
}
