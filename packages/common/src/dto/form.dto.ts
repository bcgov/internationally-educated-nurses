import { IsJSON, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class FormDTO {
  @ApiProperty({
    description: 'The name of the file',
    default: '*.csv',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 256)
  file_name!: string;

  @ApiProperty({
    description: 'The path to the file',
    default: 'https://someurl.com/path/*.csv',
    type: String,
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  file_path!: string;

  @ApiProperty({
    description: 'The person assigned to the file',
    default: 'Karl',
    type: String,
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  assigned_to!: string;
  @ApiProperty({
    description: 'A JSON string of the files contents',
    default: '{"key":"value"}',
  })
  @IsJSON()
  @IsNotEmpty()
  form_data!: string;
}
