import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class IENApplicantJobCreateUpdateDTO {
  @IsString()
  @IsNotEmpty({ message: 'HA is required' })
  ha_pcn!: string;

  @IsString({ message: 'Job ID must be a string' })
  @IsOptional()
  job_id?: string;

  @IsString()
  @IsOptional()
  job_title?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one community is required' })
  job_location!: number[];

  @ValidateIf(d => d.job_post_date !== '')
  @IsDateString()
  @IsOptional()
  job_post_date?: string;
}
