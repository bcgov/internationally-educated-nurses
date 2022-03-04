import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicantUpdateDTO } from '@ien/common';

export class ApplicantUpdateAPIDTO extends ApplicantUpdateDTO {
  @ApiPropertyOptional({ description: 'Applicant First Name', default: 'Mark' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  first_name?: string;

  @ApiPropertyOptional({ description: 'Applicant Last Name', default: 'Bowill' })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ description: 'Applicant profession', default: 'Nurse Practitioner' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  profession?: string;

  @ApiPropertyOptional({ description: 'Applicant specialty', default: null })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  specialty?: string;

  @ApiPropertyOptional({ description: 'Applicant assigned to', default: 'Makers' })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  assigned_to?: string;

  @ApiPropertyOptional({ description: "Applicant's applied HA/PCN", default: 'VIHA' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(1, 256)
  ha_pcn?: string;

  @ApiPropertyOptional({
    description: "Applicant current status, Check ApplicantStatus API for status' integer value",
    default: 4,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: "Applicant's first referral date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  first_referral?: Date;

  @ApiPropertyOptional({
    description: "Applicant's latest referral date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  latest_referral?: Date;

  @ApiPropertyOptional({
    description: 'Followed up W/Candidate date',
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  followed_up?: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  date_matched?: Date;

  @ApiPropertyOptional({ default: null })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  comment?: string;

  @ApiProperty({
    description: 'Logged-in user-name, This will remove once authentication module setup',
    default: 'Jack',
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  added_by?: string;

  @ApiProperty({
    description: 'Logged-in userId, This will remove once authentication module setup',
    default: 'abhcd1-89cbd0e9-4bha6d87c-amc34ee59',
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  added_by_id?: string;

  @ApiPropertyOptional({
    description: "Optional status that shows current applicant's application is active or closed",
  })
  @IsBoolean()
  @IsOptional()
  is_open?: boolean;

  @ApiPropertyOptional({
    description:
      'If we do have more data than above given attributes, put it in a JSON and store here',
    default: null,
  })
  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  // Use this field when status start date is not current date
  @ApiPropertyOptional({
    description:
      'It is status start-date, sometime we might need to give past date as status start date. and use when status is provided',
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString()
  @IsOptional()
  status_date?: Date;
}
