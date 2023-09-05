import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BccnmNcasValidation } from '@ien/common';

export class BccnmNcasValidationRO implements BccnmNcasValidation {
  @ApiModelProperty({
    description: `Applicant's unique ID from HMBC ATS`,
  })
  id!: string;

  @ApiModelProperty({
    description: `Applicant's unique ID`,
  })
  applicantId!: string;

  @ApiModelProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  dateOfRosContract!: string;

  @ApiModelProperty({
    description: 'Full name',
  })
  name!: string;

  @ApiModelProperty({
    description: 'NCAS Assessment Complete',
  })
  ncasComplete!: boolean;

  @ApiModelProperty({
    description: 'BCCNM Application Complete',
  })
  appliedToBccnm!: boolean;

  @ApiModelProperty({
    description: 'Registration designation',
  })
  designation!: string;

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
