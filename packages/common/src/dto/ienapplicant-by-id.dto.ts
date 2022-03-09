import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';

export class IENApplicantFilterByIdDTO {
  @IsNotEmpty()
  @Length(1, 256)
  @IsOptional()
  @IsString()
  relation?: string;
}
