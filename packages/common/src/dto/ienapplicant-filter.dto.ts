import { IsOptional, IsString } from 'class-validator';
import { SortFilterDTO } from './sort-filter.dto';

export class IENApplicantFilterDTO extends SortFilterDTO {
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
