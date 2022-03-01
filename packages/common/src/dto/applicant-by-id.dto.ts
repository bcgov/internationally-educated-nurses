import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicantFilterByIdDTO {
  @ApiPropertyOptional({ description: 'Get additional data like audit' })
  @IsNotEmpty()
  @Length(1, 256)
  @IsOptional()
  @IsString()
  relation?: string;
}
