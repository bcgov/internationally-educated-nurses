import { IsNotEmpty, IsString } from 'class-validator';

export class NursingEducationDTO {
  constructor(name: string, year: string, country: string, num_years: string) {
    this.name = name;
    this.year = year;
    this.country = country;
    this.num_years = num_years;
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
