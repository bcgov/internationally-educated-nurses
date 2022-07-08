import { IsNotEmpty, IsString } from 'class-validator';

export class NursingEducationDTO {
  constructor(base: NursingEducationDTO) {
    this.name = base.name;
    this.year = base.year;
    this.country = base.country;
    this.num_years = base.num_years;
  }

  @IsString()
  @IsNotEmpty({ message: 'Education Name is required' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Year is required' })
  year!: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country!: string;

  @IsString()
  @IsNotEmpty({ message: 'Number of Years is required' })
  num_years!: string;
}
