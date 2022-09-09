import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { STATUS } from '../enum';

export class IENApplicantAddStatusDTO {
  @IsString()
  @IsNotEmpty({ message: 'Milestone/Status is required' })
  status!: string;

  @IsString()
  @IsOptional()
  job_id?: string;

  @IsString()
  @IsOptional()
  added_by?: string;

  @IsDateString({}, { message: 'Must be a valid Date' })
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString({ message: 'Notes/Reason must be a string' })
  @IsOptional()
  notes?: string;

  @ValidateIf(
    s =>
      s.status === `${STATUS.WITHDREW_FROM_COMPETITION}` ||
      s.status == `${STATUS.WITHDREW_FROM_PROGRAM}`,
  )
  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason?: string;

  @IsString()
  @IsOptional()
  reason_other?: string;

  @ValidateIf(s => s.status === `${STATUS.JOB_OFFER_ACCEPTED}`)
  @IsDateString({}, { message: 'Must be a valid Date' })
  @IsOptional()
  effective_date?: string;
}
