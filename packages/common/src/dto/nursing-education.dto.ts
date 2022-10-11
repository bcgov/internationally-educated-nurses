import { IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf } from 'class-validator';

export class NursingEducationDTO {
  constructor(name: string, year: string, country: string, num_years: string) {
    this.name = name;
    this.year = +year;
    this.country = country;
    this.num_years = +num_years;
  }

  @IsString()
  @IsNotEmpty({ message: 'Education Name is required' })
  @ValidateIf(o => Object.values(o).some(v => v !== ''))
  name!: string;

  @Max(new Date().getFullYear())
  @Min(1900)
  @IsNumber()
  @IsNotEmpty({ message: 'Year is required' })
  @ValidateIf(({ name }) => !!name && name !== 'undefined')
  year!: number;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  @ValidateIf(({ name }) => !!name && name !== 'undefined')
  country!: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty({ message: 'Number of Years is required' })
  @ValidateIf(({ name }) => !!name && name !== 'undefined')
  num_years!: number;
}
