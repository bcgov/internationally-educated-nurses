import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { IenType, IENApplicantUpdateStatusDTO, STATUS } from '@ien/common';

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
  @ValidateIf(s => s.status === STATUS.JOB_OFFER_ACCEPTED)
  @IsDateString()
  @IsOptional()
  effective_date?: string;

  @ApiPropertyOptional({
    description: 'IEN type as HCA, LPN, RN',
    type: 'string',
  })
  @ValidateIf(s => s.status === STATUS.JOB_OFFER_ACCEPTED)
  @IsEnum(IenType)
  @IsOptional()
  type?: IenType;
}
