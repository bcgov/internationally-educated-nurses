import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class ApplicantCreateDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  first_name!: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  profession!: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  specialty?: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  assigned_to?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  ha_pcn!: string;

  @IsString()
  status!: string;

  @IsDateString()
  @IsOptional()
  first_referral?: Date;

  @IsDateString()
  @IsOptional()
  latest_referral?: Date;

  @IsDateString()
  @IsOptional()
  followed_up?: Date;

  @IsDateString()
  @IsOptional()
  date_matched?: Date;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  comment?: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  added_by?: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  added_by_id?: string;

  @IsBoolean()
  @IsOptional()
  is_open?: boolean;

  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  // Use this field when status start date is not current date
  @IsDateString()
  @IsOptional()
  status_date?: Date;
}
