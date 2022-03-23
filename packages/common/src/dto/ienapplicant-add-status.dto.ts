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
  start_date?: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsString({ message: 'Notes/Reason must be a string' })
  @IsOptional()
  notes?: string;
}
