import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IenType, STATUS } from '../enum';

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

  @IsString({ message: 'Notes/Reason must be a string' })
  @IsOptional()
  notes?: string;

  @ValidateIf(s => s.status === STATUS.WITHDREW_FROM_COMPETITION)
  @IsString()
  @IsNotEmpty({ message: 'Reason is required' })
  reason?: string;

  @IsString()
  @IsOptional()
  reason_other?: string;

  @ValidateIf(s => s.status === STATUS.JOB_OFFER_ACCEPTED)
  @IsDateString({}, { message: 'Must be a valid Date' })
  effective_date?: string;

  @ValidateIf(s => s.status === STATUS.JOB_OFFER_ACCEPTED)
  @IsEnum(IenType, { message: `Type is required for 'Job Offer Accepted'` })
  type?: IenType;
}
