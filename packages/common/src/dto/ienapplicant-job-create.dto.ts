import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IENApplicantJobCreateUpdateDTO {
  @IsString()
  ha_pcn!: string;

  @IsString()
  job_id?: string;

  @IsString()
  job_title!: string;

  @IsString()
  job_location!: string;

  @IsString()
  @IsOptional()
  recruiter_name?: string;

  @IsDateString()
  @IsOptional()
  job_post_date?: Date;
}
