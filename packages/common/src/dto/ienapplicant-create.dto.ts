import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class IENApplicantCreateDTO {
  @Length(1, 256, { message: 'Please provide applicant name' })
  name!: string;

  @Length(1, 256, { message: 'Please provide applicant unique ID' })
  @IsOptional()
  applicant_id?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  citizenship?: string;

  @IsOptional()
  country_of_training?: string;

  @IsOptional()
  pr_of_canada?: boolean;

  @IsArray()
  @IsOptional()
  ha_pcn?: [string];

  @IsArray()
  @IsOptional()
  assigned_to?: [string];

  @IsString()
  status!: string;

  @IsString()
  added_by!: string;

  @IsOptional()
  education?: string;

  @IsDateString()
  @IsOptional()
  registration_date?: Date;

  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  @IsDateString()
  @IsOptional()
  status_date?: Date;

  @IsBoolean()
  @IsOptional()
  is_open!: boolean;
}
