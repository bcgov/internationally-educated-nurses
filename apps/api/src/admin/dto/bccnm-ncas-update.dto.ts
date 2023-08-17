import { IsArray, IsDateString, IsIn, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { BccnmNcasValidation } from '@ien/common';
import { Type } from 'class-transformer';

export class BccnmNcasUpdateItemDTO implements BccnmNcasValidation {
  @ApiModelProperty({
    description: `IEN's unique ID from HMBC ATS`,
  })
  @IsUUID()
  id!: string;

  @ApiModelProperty({
    description: `The date of the signature of ROS(return of service)`,
  })
  @IsDateString()
  dateOfRosContract!: string;

  @ApiModelProperty({
    description: 'ID of current "Signed Return of Service Agreement" milestone',
  })
  @ValidateIf(o => o.message === 'Update')
  @IsUUID()
  statusId?: string;

  @ApiModelProperty({
    description: 'Specify whether the milestone should be created or updated',
  })
  @IsIn(['Create', 'Update'])
  message!: 'Create' | 'Update';
}

export class BccnmNcasUpdateDTO {
  @IsArray()
  @ValidateNested()
  @Type(() => BccnmNcasUpdateItemDTO)
  data!: BccnmNcasUpdateItemDTO[];
}
