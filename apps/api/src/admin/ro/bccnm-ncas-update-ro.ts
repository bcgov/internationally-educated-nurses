import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class BccnmNcasUpdateRO {
  @ApiModelProperty({
    description: 'Number of milestones created',
  })
  created!: number;

  @ApiModelProperty({
    description: 'Number of milestones updated',
  })
  updated!: number;

  @ApiModelProperty({
    description: 'Number of milestones dropped',
  })
  ignored!: number;
}
