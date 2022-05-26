import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class IENApplicantJobCreateUpdateDTO {
  @IsString()
  @IsNotEmpty({ message: 'HA is required' })
  ha_pcn!: string;

  @IsString({ message: 'JobID must be a string' })
  @IsOptional()
  job_id?: string;

  @IsString()
  @IsOptional()
  job_title?: string;

  @IsString()
  @IsOptional()
  job_location?: string | string[];

  @IsString({ message: 'HA Recruiter Name must be a string' })
  @Length(1, 255, { message: 'Recruiter Name must be between 1 and 255 characters' })
  @IsNotEmpty({ message: 'HA Recruiter Name is required' })
  recruiter_name!: string;

  @ValidateIf(d => d.job_post_date !== '')
  @IsDateString()
  @IsOptional()
  job_post_date?: string;
}
