import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IENApplicantFilterByIdDTO } from '@ien/common';

export class IENApplicantFilterByIdAPIDTO extends IENApplicantFilterByIdDTO {
  @ApiPropertyOptional({
    description:
      'Get additional data, available values are [audit, applicantaudit]. Pass it as comma separated like audit or audit,applicantaudit or applicantaudit',
  })
  @IsNotEmpty()
  @Length(1, 256)
  @IsOptional()
  @IsString()
  relation?: string;
}
