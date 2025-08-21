import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BccnmNcasValidation } from '@ien/common';
import { Type } from 'class-transformer';

export class BccnmNcasUpdateItemDTO implements BccnmNcasValidation {
  @ApiProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  id!: string;

  @ApiProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  @IsUUID()
  applicantId!: string;

  @ApiProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  @IsDateString()
  @IsOptional()
  dateOfRosContract?: string;

  @ApiProperty({
    description: 'Date NCAS Assessment Complete',
  })
  @IsDateString()
  @IsOptional()
  ncasCompleteDate?: string;

  @ApiProperty({
    description: 'BCCNM Application Complete',
  })
  @IsOptional()
  @IsDateString()
  appliedToBccnm?: string;

  @ApiProperty({
    description: `Registration Designation`,
  })
  @IsString()
  designation?: string;

  @ApiProperty({
    description: `Country of Education`,
  })
  @IsString()
  @IsOptional()
  countryOfEducation?: string;

  @ApiProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  @ValidateIf(o => o.message === 'Update')
  @IsUUID()
  rosStatusId?: string;

  @ApiProperty({
    description: 'Date BCCNM Application Complete',
  })
  @IsDateString()
  @IsOptional()
  bccnmApplicationCompleteDate?: string;

  @ApiProperty({
    description: 'BCCNM Decision Date',
  })
  @IsDateString()
  @IsOptional()
  bccnmDecisionDate?: string;

  @ApiProperty({
    description: 'BCCNM Full Licence LPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceLPN?: string;

  @ApiProperty({
    description: 'BCCNM Full Licence RPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceRPN?: string;

  @ApiProperty({
    description: 'BCCNM Full Licence RN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceRN?: string;

  @ApiProperty({
    description: 'BCCNM Provisional Licence RN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceRN?: string;

  @ApiProperty({
    description: 'BCCNM Provisional Licence LPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceLPN?: string;

  @ApiProperty({
    description: 'BCCNM Provisional Licence RPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceRPN?: string;

  @ApiProperty({ description: 'BCCNM Full Licence LPN ID' })
  @IsOptional()
  bccnmFullLicenceLPNID?: string;

  @ApiProperty({ description: 'BCCNM Full Licence RN ID ' })
  @IsOptional()
  bccnmFullLicenceRPNID?: string;

  @ApiProperty({ description: 'BCCNM Full Licesnse RPN ID ' })
  @IsOptional()
  bccnmFullLicenceRNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceRNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceLPNID?: string;

  @ApiProperty({ description: 'BCCNM Provisional Licence LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceRPNID?: string;
}

export class BccnmNcasUpdateDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => BccnmNcasUpdateItemDTO)
  data!: BccnmNcasUpdateItemDTO[];
}
