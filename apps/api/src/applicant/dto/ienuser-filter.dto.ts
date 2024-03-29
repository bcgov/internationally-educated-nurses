import { IsNumberString, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IENUserFilterAPIDTO {
  @ApiPropertyOptional({
    description: 'Start date for range',
    example: '2020-01-01',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for range',
  })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Organization to sort by',
    example: 'VIHA',
  })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional({
    description: 'Limit the number of results',
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Skip the number of results',
  })
  @IsOptional()
  @IsNumberString()
  skip?: number;
}
