import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobQueryOptions } from '@ien/common';

export class IENApplicantJobQueryDTO implements JobQueryOptions {
  @ApiPropertyOptional({
    description: 'Provide job_id',
  })
  @IsOptional()
  @IsString()
  job_id?: string;

  @ApiPropertyOptional({
    description: 'Provide list of health authority IDs separated by ","',
  })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  ha_pcn?: string[];

  @ApiPropertyOptional({
    description: 'Provide list of job title IDs separated by ","',
  })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  job_title?: string[];

  @ApiPropertyOptional({
    description: 'Skip the number of results',
  })
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional({
    description: 'Limit the number of results',
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
