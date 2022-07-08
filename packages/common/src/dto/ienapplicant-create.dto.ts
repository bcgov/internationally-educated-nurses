import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsArray,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { NursingEducationDTO } from './nursing-education.dto';

export class IENApplicantCreateUpdateDTO {
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant first name' })
  first_name!: string;

  @IsString()
  @Length(1, 256, { message: 'Please provide applicant last name' })
  last_name!: string;

  @IsOptional()
  applicant_id?: number;

  @IsEmail({}, { message: 'Must be a valid Email' })
  @Length(1, 256)
  @IsNotEmpty({ message: 'Email is required' })
  email_address!: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Must be a valid Phone Number' })
  @Length(1, 256, { message: 'Please provide applicant phone' })
  phone_number?: string;

  @IsDateString({}, { message: 'Must be a valid Date' })
  @IsNotEmpty({ message: 'Registration Date is required' })
  registration_date!: string;

  @IsArray()
  @IsOptional()
  assigned_to?: JSON;

  @ArrayNotEmpty({ message: 'Country of Citizenship is required' })
  country_of_citizenship!: string[] | string;

  @IsNotEmpty({ message: 'Country of Residence is required' })
  country_of_residence!: string;

  @IsNotEmpty({ message: 'Permanent Residence Status is required' })
  pr_status!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: 'Education is required' })
  nursing_educations!: NursingEducationDTO[];

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
