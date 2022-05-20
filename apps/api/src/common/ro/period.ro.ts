import { Period } from '@ien/common';
import { ApiProperty } from '@nestjs/swagger';

export class PeriodRO implements Period {
  @ApiProperty({ description: 'Reporting Period', example: 'Period 1' })
  period!: string;

  @ApiProperty({ description: 'Start date of report', example: '2022-05-09' })
  from!: string;

  @ApiProperty({ description: 'End date of report', example: '2022-06-05' })
  to!: string;

  @ApiProperty({ description: 'Number of applicants', example: 32 })
  applicants!: number;
}