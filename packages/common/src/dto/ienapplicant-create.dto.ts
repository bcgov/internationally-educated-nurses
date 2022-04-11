import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class IENApplicantCreateUpdateDTO {
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant first name' })
  first_name!: string;

  @IsString()
  @Length(1, 256, { message: 'Please provide applicant last name' })
  last_name!: string;

  @IsOptional()
  applicant_id?: number;

  @IsOptional()
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant email' })
  email_address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant phone' })
  phone_number?: string;

  @IsDateString()
  @IsOptional()
  registration_date?: Date;

  @IsArray()
  @IsOptional()
  assigned_to?: JSON;

  @IsOptional()
  country_of_citizenship?: string[] | string;

  @IsOptional()
  country_of_residence?: string;

  @IsOptional()
  pr_status?: string;

  @IsArray()
  @IsOptional()
  nursing_educations?: JSON;

  @IsOptional()
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant bccnm license number' })
  bccnm_license_number?: string;

  @IsArray()
  @IsOptional()
  health_authorities?: JSON;

  @IsArray()
  @IsOptional()
  notes?: JSON;

  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  @IsBoolean()
  @IsOptional()
  is_open!: boolean;
}
