import { IsOptional, IsString } from 'class-validator';

export class ApplicantFilterDTO {
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
