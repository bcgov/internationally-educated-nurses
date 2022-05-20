import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { SortFilterDTO } from '@ien/common';

export class SortFilterAPIDTO extends SortFilterDTO {
  @ApiPropertyOptional({
    description: 'Field name to sort results',
  })
  @IsOptional()
  @IsString()
  sortKey?: string;

  @ApiPropertyOptional({
    description: 'Limit the number of results',
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Skip the number of results',
    example: 0,
  })
  @IsOptional()
  @IsNumberString()
  skip?: number;
}
