import { IENApplicantUpdateStatusDTO } from '@ien/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IENApplicantUpdateStatusAPIDTO extends IENApplicantUpdateStatusDTO {
  @ApiProperty({ description: 'Applicant active or last updated status', default: '3' })
  @IsString()
  status?: string;

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
