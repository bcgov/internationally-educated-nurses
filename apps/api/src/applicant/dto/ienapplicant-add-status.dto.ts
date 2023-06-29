import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IENApplicantAddStatusDTO, STATUS } from '@ien/common';

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
  start_date!: string;

  @ApiPropertyOptional({ description: 'Applicant status note', default: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Reason for milestone/status from predefined list',
    default: '1',
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({
    description: 'If reason not available in predefined list, provide here',
    default: 'Low payscale',
  })
  @IsString()
  @IsOptional()
  reason_other?: string;

  @ApiPropertyOptional({
    description: 'This will be start date for recruitment related job/competition',
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @ValidateIf(s => s.status === STATUS.JOB_OFFER_ACCEPTED)
  @IsDateString()
  @IsOptional()
  effective_date?: string;
}
