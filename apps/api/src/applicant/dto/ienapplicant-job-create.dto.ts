import { IENApplicantJobCreateUpdateDTO } from '@ien/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length, IsNotEmpty } from 'class-validator';

export class IENApplicantJobCreateUpdateAPIDTO extends IENApplicantJobCreateUpdateDTO {
  @ApiProperty({ description: "Job's HA/PCN", default: '1' })
  @IsNotEmpty({ message: 'HA is required' })
  @IsString()
  ha_pcn!: string;

  @ApiPropertyOptional({
    description: 'Job Id from other system for reference',
    default: 'ABC1234',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255, { message: 'JobID must be between 1 and 255 characters' })
  job_id?: string;

  @ApiProperty({ description: 'Job title Id', default: '1' })
  @IsNotEmpty({ message: 'Job Title is required' })
  @IsString()
  job_title!: string;

  @ApiProperty({ description: 'Job location Id', default: '1' })
  @IsNotEmpty({ message: 'Job Location is required' })
  @IsString()
  job_location!: string;

  @ApiPropertyOptional({ description: 'recruiter name', default: 'Mark Brown' })
  @IsString()
  @IsOptional()
  @Length(1, 255, { message: 'Recruiter Name must be between 1 and 255 characters' })
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
