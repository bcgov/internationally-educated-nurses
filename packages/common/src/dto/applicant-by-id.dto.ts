import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';

export class ApplicantFilterByIdDTO {
  @IsNotEmpty()
  @Length(1, 256)
  @IsOptional()
  @IsString()
  relation?: string;
}
