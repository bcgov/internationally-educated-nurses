import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsObject,
  IsBoolean,
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  IsEmail,
  ArrayMinSize,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { IENApplicantCreateUpdateDTO, NursingEducationDTO } from '@ien/common';
import { Type } from 'class-transformer';

export class IENApplicantCreateUpdateAPIDTO extends IENApplicantCreateUpdateDTO {
  @ApiProperty({ description: 'Applicant First Name', default: 'Mark' })
  @IsString()
  @Length(1, 64, { message: 'Please provide applicant first name' })
  first_name!: string;

  @ApiProperty({ description: 'Applicant Name', default: 'Bowlill' })
  @IsString()
  @Length(1, 64, { message: 'Please provide applicant last name' })
  last_name!: string;

  @ApiPropertyOptional({
    description: 'Applicant unique ID',
    default: 1,
  })
  @IsOptional()
  applicant_id?: number;

  @ApiPropertyOptional({
    description: 'Applicant email address',
    default: 'mark.bowill@mailinator.com',
  })
  @IsEmail({}, { message: 'Must be a valid Email' })
  @Length(1, 256)
  @IsNotEmpty({ message: 'Email is required' })
  email_address!: string;

  @ApiPropertyOptional({
    description: 'Applicant phone number',
    default: '77-555-1234',
  })
  @IsOptional()
  @IsString()
  @Length(1, 18, { message: 'Please provide applicant phone' })
  phone_number?: string;

  @ApiPropertyOptional({
    description: "Applicant's registration date",
    type: 'string',
    format: 'date',
    pattern: 'YYYY-MM-DD',
  })
  @IsDateString({}, { message: 'Must be a valid Date' })
  @IsNotEmpty({ message: 'Registration Date is required' })
  registration_date!: string;

  @ApiPropertyOptional({
    description: 'Assigned Applicant to',
    default: [{ id: 1 }],
  })
  @IsArray()
  @IsOptional()
  assigned_to?: JSON;

  @ApiPropertyOptional({ description: 'Applicant citizenship', default: ['ca'] })
  @ArrayNotEmpty({ message: 'Country of Citizenship is required' })
  country_of_citizenship!: string[] | string;

  @ApiPropertyOptional({ description: 'Applicant country of residence', default: 'us' })
  @IsNotEmpty({ message: 'Country of Residence is required' })
  country_of_residence!: string;

  @ApiPropertyOptional({ description: 'Applicant have PR of Canada', default: 'PR' })
  @IsNotEmpty({ message: 'Permanent Residence Status is required' })
  pr_status!: string;

  @ApiPropertyOptional({
    description: 'Nursing educations',
    default: [
      { name: 'PhD', country: 'ca' },
      { name: 'Master of Nursing', country: 'ca' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 Education is required' })
  @ArrayNotEmpty({ message: 'Education is required' })
  @ValidateIf(e => e.nursing_educations.length > 0)
  @ValidateNested()
  @Type(() => NursingEducationDTO)
  nursing_educations!: NursingEducationDTO[];

  @ApiPropertyOptional({ description: 'Applicant bccnm license number', default: '545432A' })
  @IsOptional()
  @IsString()
  @Length(1, 256, { message: 'Please provide applicant bccnm license number' })
  bccnm_license_number?: string;

  @ApiPropertyOptional({
    description: 'Health authorities to which the applicant has referred',
    default: [{ id: 1, referral_date: '2011-04-02T00:00:00' }],
  })
  @IsArray()
  @IsOptional()
  health_authorities?: JSON;

  @ApiPropertyOptional({
    description: 'Notes: that keep an audit of non-milestone activity',
    default: [
      {
        notes: 'Some notes',
        date: '2011-05-07T00:00:00',
        type: 'Note On File',
      },
    ],
  })
  @IsArray()
  @IsOptional()
  notes?: JSON;

  @ApiPropertyOptional({
    description:
      'If we do have more data than above given attributes, put it in a JSON and store here',
    default: null,
  })
  @IsObject()
  @IsOptional()
  additional_data?: JSON;

  @ApiPropertyOptional({
    description: "Optional status that shows current applicant's application is active or closed",
  })
  @IsBoolean()
  @IsOptional()
  is_open!: boolean;
}
