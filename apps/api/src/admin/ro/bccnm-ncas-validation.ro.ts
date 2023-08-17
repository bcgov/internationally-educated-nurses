import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { SuccessResponse } from '../../common/ro/success-response.ro';
import { BccnmNcasValidation } from '@ien/common';

export class BccnmNcasValidationRO implements BccnmNcasValidation {
  @ApiModelProperty({
    description: `Applicant's unique ID from HMBC ATS`,
  })
  id!: string;

  @ApiModelProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  dateOfRosContract!: string;

  @ApiModelProperty({
    description: 'Full name',
  })
  name!: string;

  @ApiModelProperty({
    description: 'Validation result of ROS',
  })
  message!: string;

  @ApiModelProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  statusId?: string;

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
