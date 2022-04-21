import { IsDateString, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class IENApplicantJobCreateUpdateDTO {
  @IsString()
  @IsNotEmpty({ message: 'HA is required' })
  ha_pcn!: string;

  @IsString({ message: 'JobID must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'JobID must be between 1 and 255 characters' })
  job_id?: string;

  @IsString()
  @IsNotEmpty({ message: 'Job Title is required' })
  job_title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Job Location is required' })
  job_location!: string;

  @IsString({ message: 'Recruiter Name must be a string' })
  @IsOptional()
  @Length(1, 255, { message: 'Recruiter Name must be between 1 and 255 characters' })
  recruiter_name?: string;

  @IsDateString()
  @IsOptional()
  job_post_date?: string;
}
