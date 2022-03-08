import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { IENApplicantCreateDTO } from '@ien/common';

export class IENApplicantCreateAPIDTO extends IENApplicantCreateDTO {
  @ApiProperty({ description: 'Applicant Name', default: 'Mark Bowlill' })
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant name' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Applicant unique ID',
    default: 'a989765-c8789299-b9696669-dfcba98',
  })
  @Length(1, 256, { message: 'Please provide applicant name' })
  @IsOptional()
  applicant_id?: string;

  @ApiPropertyOptional({
    description: 'Applicant email address',
    default: 'mark.bowill@mailinator.com',
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Applicant citizenship', default: 'Maxico' })
  @IsOptional()
  citizenship?: string;

  @ApiPropertyOptional({ description: 'Applicant country of Origin', default: 'Maxico' })
  @IsOptional()
  country_of_training?: string;

  @ApiPropertyOptional({ description: 'Applicant have PR of Canada', default: false })
  @IsOptional()
  pr_of_canada?: boolean;

  @ApiPropertyOptional({ description: 'Applicant HA/PCN', default: ['1', '2'] })
  @IsArray()
  ha_pcn?: [string];

  @ApiPropertyOptional({ description: 'Applicant assigned to', default: ['1'] })
  @IsArray()
  assigned_to?: [string];

  @ApiPropertyOptional({
    description: 'Applicant education, put it in comma separated',
    default: 'PhD, Master of Nursing',
  })
  @IsOptional()
  education?: string;

  @ApiProperty({ description: 'Applicant active or last updated status', default: '3' })
  @IsString()
  status!: string;

  @ApiProperty({ description: 'Applicant added by user', default: '2' })
  @IsString()
  added_by!: string;

  @ApiPropertyOptional({
    description: "Applicant's registration date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  registration_date?: Date;

  @ApiPropertyOptional({
    description:
      'If we do have more data than above given attributes, put it in a JSON and store here',
    default: null,
  })
  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  @ApiPropertyOptional({
    description: "Applicant's status start date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  status_date?: Date;

  @ApiPropertyOptional({
    description: "Optional status that shows current applicant's application is active or closed",
  })
  @IsBoolean()
  @IsOptional()
  is_open!: boolean;
}
