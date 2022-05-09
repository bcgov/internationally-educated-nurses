import { IsDateString, IsOptional, IsString, ValidateIf } from 'class-validator';
import { STATUS } from '../enum';

export class IENApplicantUpdateStatusDTO {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  added_by?: string;

  @IsDateString({}, { message: 'Must be a valid Date' })
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @IsString({ message: 'Notes/Reason must be a string' })
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  reason_other?: string;

  @ValidateIf(s => s.status === `${STATUS.Candidate_withdrew}`)
  @IsDateString()
  @IsOptional()
  effective_date?: Date;
}
