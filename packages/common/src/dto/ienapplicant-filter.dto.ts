import { IsOptional, IsString } from 'class-validator';

export class IENApplicantFilterDTO {
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  // @IsOptional()
  // @IsString()
  // status?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
