import { IsDateString, IsOptional, IsString } from 'class-validator';

export class IENApplicantUpdateStatusDTO {
  @IsString()
  status!: string;

  @IsString()
  @IsOptional()
  ha_pcn?: string;

  @IsString()
  @IsOptional()
  added_by?: string;

  @IsDateString()
  @IsOptional()
  status_date?: Date;
}
