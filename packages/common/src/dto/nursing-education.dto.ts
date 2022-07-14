import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf } from 'class-validator';

export class NursingEducationDTO {
  constructor(name: string, year: number | null, country: string, num_years: number | null) {
    this.name = name;
    this.year = year;
    this.country = country;
    this.num_years = num_years;
  }

  @IsString()
  @IsNotEmpty({ message: 'Education Name is required' })
  @ValidateIf(o => Object.values(o).some(v => v !== ''))
  name!: string;

  @Max(new Date().getFullYear())
  @Min(1900)
  @IsNumber()
  @IsNotEmpty({ message: 'Year is required' })
  @ValidateIf(o => Object.values(o).some(v => v !== ''))
  year!: number | null;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  @ValidateIf(o => Object.values(o).some(v => v !== ''))
  country!: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty({ message: 'Number of Years is required' })
  @ValidateIf(o => Object.values(o).some(v => v !== ''))
  num_years!: number | null;
}
