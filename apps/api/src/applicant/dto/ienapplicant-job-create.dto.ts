import { IENApplicantJobCreateUpdateDTO } from '@ien/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IENApplicantJobCreateUpdateAPIDTO extends IENApplicantJobCreateUpdateDTO {
  @ApiProperty({ description: "Job's HA/PCN", default: '1' })
  @IsString()
  ha_pcn!: string;

  @ApiPropertyOptional({
    description: 'Job Id from other system for reference',
    default: 'ABC1234',
  })
  @IsString()
  job_id?: string;

  @ApiProperty({ description: 'Job title Id', default: '1' })
  @IsString()
  job_title!: string;

  @ApiProperty({ description: 'Job location Id', default: '1' })
  @IsString()
  job_location!: string;

  @ApiPropertyOptional({ description: 'recruiter name', default: 'Mark Brown' })
  @IsString()
  @IsOptional()
  recruiter_name?: string;

  @ApiPropertyOptional({
    description: 'Date job was first posted',
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  job_post_date?: Date;
}
