import { IsBoolean, IsNumberString, IsOptional, IsString } from 'class-validator';

export class EmployeeFilterDTO {
  @IsOptional()
  @IsString({ each: true })
  role?: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  revokedOnly?: boolean;

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
