import { IsOptional, IsString } from 'class-validator';

export class ApplicantFilterDto {
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
