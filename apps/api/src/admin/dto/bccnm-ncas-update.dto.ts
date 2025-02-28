import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BccnmNcasValidation } from '@ien/common';
import { Type } from 'class-transformer';

export class BccnmNcasUpdateItemDTO implements BccnmNcasValidation {
  @ApiModelProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  id!: string;

  @ApiModelProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  @IsUUID()
  applicantId!: string;

  @ApiModelProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  @IsDateString()
  @IsOptional()
  dateOfRosContract?: string;

  @ApiModelProperty({
    description: 'Date NCAS Assessment Complete',
  })
  @IsDateString()
  @IsOptional()
  ncasCompleteDate?: string;

  @ApiModelProperty({
    description: 'BCCNM Application Complete',
  })
  @IsOptional()
  @IsDateString()
  appliedToBccnm?: string;

  @ApiModelProperty({
    description: `Registration Designation`,
  })
  @IsString()
  designation?: string;

  @ApiModelProperty({
    description: `Country of Education`,
  })
  @IsString()
  @IsOptional()
  countryOfEducation?: string;

  @ApiModelProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  @ValidateIf(o => o.message === 'Update')
  @IsUUID()
  rosStatusID?: string;

  @ApiModelProperty({
    description: 'Date BCCNM Application Complete',
  })
  @IsDateString()
  @IsOptional()
  bccnmApplicationCompleteDate?: string;

  @ApiModelProperty({
    description: 'BCCNM Decision Date',
  })
  @IsDateString()
  @IsOptional()
  bccnmDecisionDate?: string;

  @ApiModelProperty({
    description: 'BCCNM Full License LPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceLPN?: string;

  @ApiModelProperty({
    description: 'BCCNM Full License RPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceRPN?: string;

  @ApiModelProperty({
    description: 'BCCNM Full License RN',
  })
  @IsDateString()
  @IsOptional()
  bccnmFullLicenceRN?: string;

  @ApiModelProperty({
    description: 'BCCNM Provisional License RN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceRN?: string;

  @ApiModelProperty({
    description: 'BCCNM Provisional License LPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceLPN?: string;

  @ApiModelProperty({
    description: 'BCCNM Provisional License RPN',
  })
  @IsDateString()
  @IsOptional()
  bccnmProvisionalLicenceRPN?: string;

  @ApiModelProperty({ description: 'BCCNM Full License LPN ID' })
  @IsOptional()
  bccnmFullLicenceLPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Full License RN ID ' })
  @IsOptional()
  bccnmFullLicenceRPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Full Licesnse RPN ID ' })
  @IsOptional()
  bccnmFullLicenceRNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceRNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceLPNID?: string;

  @ApiModelProperty({ description: 'BCCNM Provisional License LPN ID' })
  @IsOptional()
  bccnmProvisionalLicenceRPNID?: string;
}

export class BccnmNcasUpdateDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => BccnmNcasUpdateItemDTO)
  data!: BccnmNcasUpdateItemDTO[];
}
