import { IsJSON, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
export class FormDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  file_name!: string;

  @IsString()
  @Length(1, 256)
  @IsOptional()
  file_path!: string;

  @IsJSON()
  @IsNotEmpty()
  form_data!: string;
}
