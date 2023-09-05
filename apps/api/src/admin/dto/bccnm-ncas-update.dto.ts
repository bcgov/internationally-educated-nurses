import {
  IsArray,
  IsBoolean,
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
    description: 'NCAS Assessment Complete',
  })
  @IsDateString()
  @IsOptional()
  ncasComplete?: string;

  @ApiModelProperty({
    description: 'BCCNM Application Complete',
  })
  @IsDateString()
  @IsOptional()
  appliedToBccnm?: string;

  @ApiModelProperty({
    description: `Registration Designation`,
  })
  @IsString()
  designation?: string;

  @ApiModelProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  @ValidateIf(o => o.message === 'Update')
  @IsUUID()
  statusId?: string;
}

export class BccnmNcasUpdateDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => BccnmNcasUpdateItemDTO)
  data!: BccnmNcasUpdateItemDTO[];
}
