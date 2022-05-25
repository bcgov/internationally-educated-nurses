import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { SortFilter } from '../interfaces';

export class SortFilterDTO implements SortFilter {
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
