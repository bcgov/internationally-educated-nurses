import { ApiProperty } from '@nestjs/swagger';
import { BccnmNcasValidation } from '@ien/common';

export class BccnmNcasValidationRO implements BccnmNcasValidation {
  @ApiProperty({
    description: `Applicant's unique ID from HMBC ATS`,
  })
  id!: string;

  @ApiProperty({
    description: `Applicant's unique ID`,
  })
  applicantId!: string;

  @ApiProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  dateOfRosContract?: string;

  @ApiProperty({
    description: 'Full name',
  })
  name!: string;

  @ApiProperty({
    description: 'Date NCAS Assessment Complete',
  })
  ncasCompleteDate?: string;

  @ApiProperty({
    description: 'BCCNM Application Complete',
  })
  appliedToBccnm?: string;

  @ApiProperty({
    description: 'Registration designation',
  })
  designation!: string;

  @ApiProperty({
    description: `Country of Education`,
  })
  countryOfEducation?: string;

  @ApiProperty({
    description: 'Validation result of ROS',
  })
  message!: string;

  @ApiProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  rosStatusId?: string;

  @ApiProperty({
    description: '',
  })
  valid!: boolean;

  @ApiProperty({
    description: 'Date BCCNM Application Complete',
  })
  bccnmApplicationCompleteDate?: string;

  @ApiProperty({
    description: 'BCCNM Decision Date',
  })
  bccnmDecisionDate?: string;

  @ApiProperty({ description: 'BCCNM Full Licence LPN' })
  bccnmFullLicenceLPN?: string;

  @ApiProperty({ description: 'BCCNM Full Licence RN' })
  bccnmFullLicenceRPN?: string;

  @ApiProperty({ description: 'BCCNM Full Licence RPN' })
  bccnmFullLicenceRN?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceRN?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceLPN?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN' })
  bccnmProvisionalLicenceRPN?: string;

  @ApiProperty({ description: 'BCCNM Full Licence LPN ID' })
  bccnmFullLicenceLPNID?: string;

  @ApiProperty({ description: 'BCCNM Full Licence RN ID ' })
  bccnmFullLicenceRPNID?: string;

  @ApiProperty({ description: 'BCCNM Full Licence RPN ID ' })
  bccnmFullLicenceRNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  bccnmProvisionalLicenceRNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  bccnmProvisionalLicenceLPNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  bccnmProvisionalLicenceRPNID?: string;
}
