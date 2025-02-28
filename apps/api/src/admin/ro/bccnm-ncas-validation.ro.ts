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
  dateOfRosContract?: string;

  @ApiModelProperty({
    description: 'Full name',
  })
  name!: string;

  @ApiModelProperty({
    description: 'Date NCAS Assessment Complete',
  })
  ncasCompleteDate?: string;

  @ApiModelProperty({
    description: 'BCCNM Application Complete',
  })
  appliedToBccnm?: string;

  @ApiModelProperty({
    description: 'Registration designation',
  })
  designation!: string;

  @ApiModelProperty({
    description: `Country of Education`,
  })
  countryOfEducation?: string;

  @ApiModelProperty({
    description: 'Validation result of ROS',
  })
  message!: string;

  @ApiModelProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  rosStatusId?: string;

  @ApiModelProperty({
    description: '',
  })
  valid!: boolean;

  @ApiModelProperty({
    description: 'Date BCCNM Application Complete',
  })
  bccnmApplicationCompleteDate?: string;

  @ApiModelProperty({
    description: 'BCCNM Decision Date',
  })
  bccnmDecisionDate?: string;

  @ApiModelProperty({ description: 'BCCNM Full License LPN' })
  bccnmFullLicenceLPN?: string;

  @ApiModelProperty({ description: 'BCCNM Full License RN' })
  bccnmFullLicenceRPN?: string;

  @ApiModelProperty({ description: 'BCCNM Full Licesnse RPN' })
  bccnmFullLicenceRN?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceRN?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceLPN?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceRPN?: string;

  @ApiModelProperty({ description: 'BCCNM Full Licence LPN ID' })
  bccnmFullLicenceLPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Full Licence RN ID ' })
  bccnmFullLicenceRPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Full Licesnce RPN ID ' })
  bccnmFullLicenceRNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  bccnmProvisionalLicenceRNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  bccnmProvisionalLicenceLPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  bccnmProvisionalLicenceRPNID?: string;
}
