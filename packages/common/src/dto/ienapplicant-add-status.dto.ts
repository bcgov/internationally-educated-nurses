import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IENApplicantAddStatusDTO {
  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  job_id?: string;

  @IsString()
  @IsOptional()
  added_by?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString({ message: 'Notes/Reason must be a string' })
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  reason_other?: string;

  @IsDateString()
  @IsOptional()
  effective_date?: string;
}
