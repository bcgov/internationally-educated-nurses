import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicantFilterDTO } from '@ien/common';

export class ApplicantFilterAPIDTO extends ApplicantFilterDTO {
  @ApiPropertyOptional({
    description: 'Provide optional HA with comma separated values e.g. FHA,VIHA',
  })
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  @ApiPropertyOptional({
    description: 'Provide optional status(with comma separated values e.g. "9,10,11")',
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
}
