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
    description: 'NCAS Assessment Complete',
  })
  @IsDateString()
  @IsOptional()
  ncasComplete?: string;

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
  countryOfEducation?: string;

  @ApiProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  @ValidateIf(o => o.message === 'Update')
  @IsUUID()
  statusId?: string;

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
    description: 'Date of Registration',
  })
  @IsDateString()
  @IsOptional()
  bccnmRegistrationDate?: string;
}

export class BccnmNcasUpdateDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => BccnmNcasUpdateItemDTO)
  data!: BccnmNcasUpdateItemDTO[];
}
