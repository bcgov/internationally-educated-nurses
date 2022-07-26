import { IsNumber, IsOptional, IsString } from 'class-validator';

export class HaPcnDTO {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  abbreviation?: string;
}
