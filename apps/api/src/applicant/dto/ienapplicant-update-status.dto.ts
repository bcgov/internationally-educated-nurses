import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IENApplicantUpdateStatusDTO } from '@ien/common';

export class IENApplicantUpdateStatusAPIDTO extends IENApplicantUpdateStatusDTO {
  @ApiProperty({ description: 'Applicant active or last updated status', default: '3' })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ description: 'Applicant HA detail for give status', default: '1' })
  @IsString()
  @IsOptional()
  ha_pcn?: string;

  @ApiPropertyOptional({ description: 'Applicant added by user', default: '2' })
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
  status_date?: Date;
}
