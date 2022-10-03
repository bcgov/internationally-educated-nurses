import { IENApplicantUpdateStatusDTO, STATUS } from '@ien/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, ValidateIf } from 'class-validator';

export class IENApplicantUpdateStatusAPIDTO extends IENApplicantUpdateStatusDTO {
  @ApiPropertyOptional({ description: 'Applicant active or last updated status', default: '3' })
  @IsString()
  @IsOptional()
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
  start_date?: string;

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
  @ValidateIf(
    s =>
      s.status === `${STATUS.WITHDREW_FROM_COMPETITION}` ||
      s.status === `${STATUS.WITHDREW_FROM_PROGRAM}`,
  )
  @IsDateString()
  @IsOptional()
  effective_date?: string;
}
