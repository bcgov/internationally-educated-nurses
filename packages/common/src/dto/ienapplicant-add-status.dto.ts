import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IENApplicantAddStatusDTO {
  @IsString()
  status!: string;

  @IsString()
  @IsOptional()
  job_id?: string;

  @IsString()
  @IsOptional()
  added_by?: string;

  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}
