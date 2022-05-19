import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { EmployeeFilterDTO } from '@ien/common';

export class EmployeeFilterAPIDTO extends EmployeeFilterDTO {
  @ApiPropertyOptional({
    description: 'Provide optional role(with comma separated values e.g. 9,10,11)',
  })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  role?: string[];

  @ApiPropertyOptional({
    description: 'Keyword that use to filter name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Field name to sort results',
  })
  @IsOptional()
  @IsString()
  sortKey?: string;

  @ApiPropertyOptional({
    description: 'Sort order e.g. asc, desc',
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Limit the number of results',
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Skip the number of results',
  })
  @IsOptional()
  @IsNumberString()
  skip?: number;
}
