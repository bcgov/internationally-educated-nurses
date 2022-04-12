import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class IENApplicantFilterDTO {
  @IsOptional()
  @IsString()
  ha_pcn?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  sortKey?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  skip?: number;
}
