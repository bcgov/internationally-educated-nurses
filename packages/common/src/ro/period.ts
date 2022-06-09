import { PeriodFilter } from '../interfaces';

export interface Period extends PeriodFilter {
  period: number;
  applicants: number;
}
