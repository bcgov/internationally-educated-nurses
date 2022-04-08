import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IENApplicantFilterDTO } from '@ien/common';

export class IENApplicantFilterAPIDTO extends IENApplicantFilterDTO {
  @ApiPropertyOptional({
    description: 'Provide optional HA with comma separated values e.g. 1,2',
  })
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  // @ApiPropertyOptional({
  //   description: 'Provide optional status(with comma separated values e.g. 9,10,11)',
  // })
  // @IsOptional()
  // @IsString()
  // status?: string;

  @ApiPropertyOptional({
    description: 'Keyword that use to filter name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
