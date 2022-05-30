import { PeriodFilter } from '../interfaces';

export interface Period extends PeriodFilter {
  period: number;
  from: string;
  to: string;
  applicants: number;
}
