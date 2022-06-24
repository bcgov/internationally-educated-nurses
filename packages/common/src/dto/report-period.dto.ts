import { IsDateString, IsNotEmpty } from 'class-validator';

export class ReportPeriodDTO {
  @IsDateString()
  @IsNotEmpty({ message: 'Start Date is required' })
  from!: string;

  @IsDateString()
  @IsNotEmpty({ message: 'End Date is required' })
  to!: string;
}
