import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IENApplicantAddStatusDTO } from '@ien/common';

export class IENApplicantAddStatusAPIDTO extends IENApplicantAddStatusDTO {
  @ApiProperty({ description: 'Applicant active or last updated status', default: '3' })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ description: 'Applicant Job Id from IEN App', default: '1' })
  @IsString()
  @IsOptional()
  job_id?: string;

  @ApiPropertyOptional({ description: 'Applicant added by user', default: '1' })
  @IsString()
  @IsOptional()
  added_by?: string;

  @ApiPropertyOptional({
    description: "Applicant's status start date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @ApiPropertyOptional({
    description: "Applicant's status end date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @ApiPropertyOptional({ description: 'Applicant status note', default: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
