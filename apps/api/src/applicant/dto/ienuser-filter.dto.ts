import { IsNumberString, IsOptional, IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IENUserBaseFilterAPIDTO {
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
    description: 'Skip the number of results',
  })
  @IsOptional()
  @IsNumberString()
  skip?: number;
}
export class IENUserFilterAPIDTO extends IENUserBaseFilterAPIDTO {
  @ApiPropertyOptional({
    description: 'Limit the number of results',
  })
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

/**
 * As class-validator does not override the decorator @IsOptional when override the parent class, we need to create a separate class for the filter with limit
 */
export class IENUserLimitFilterAPIDTO extends IENUserBaseFilterAPIDTO {
  @ApiPropertyOptional({
    description: 'Limit the number of results',
  })
  @IsNotEmpty()
  @IsNumberString()
  limit!: number;
}
