import { ApiProperty } from '@nestjs/swagger';

export class BccnmNcasUpdateRO {
  @ApiProperty({
    description: 'Number of milestones created',
  })
  created!: number;

  @ApiProperty({
    description: 'Number of milestones updated',
  })
  updated!: number;

  @ApiProperty({
    description: 'Number of milestones dropped',
  })
  ignored!: number;
}
