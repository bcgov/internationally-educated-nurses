import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicantFilterByIdDTO } from '@ien/common';

export class ApplicantFilterByIdRO extends ApplicantFilterByIdDTO {
  @ApiPropertyOptional({ description: 'Get additional data like audit' })
  @IsNotEmpty()
  @Length(1, 256)
  @IsOptional()
  @IsString()
  relation?: string;
}
