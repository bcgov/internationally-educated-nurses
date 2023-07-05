import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IENApplicantFilterDTO } from '@ien/common';

export class IENApplicantFilterAPIDTO extends IENApplicantFilterDTO {
  @ApiPropertyOptional({
    description: 'Provide optional HA with comma separated values e.g. 1,2',
  })
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  @ApiPropertyOptional({
    description: 'Provide optional status(with comma separated values e.g. 9,10,11)',
  })
  @IsOptional()
  @IsString()
  status?: string;

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
