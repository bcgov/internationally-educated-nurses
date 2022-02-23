import { IsOptional, IsString } from 'class-validator';

export class ApplicantFilterDto {
  @IsOptional()
  @IsString()
  haPcn?: string;

  @IsOptional()
  @IsString()
  status?: string;
}