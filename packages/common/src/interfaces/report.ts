import { PeriodFilter } from './period-filter';

export interface CountryOfEducationPeriod extends PeriodFilter {
  period: number;
  us: number;
  uk: number;
  ireland: number;
  australia: number;
  philippines: number;
  india: number;
  nigeria: number;
  jamaica: number;
  kenya: number;
  canada: number;
  other: number;
  'n/a': number;
  total: number;
}

export interface ApplicantsStatusData {
  title: string;
  active: number;
  withdrawn: number;
  hired: number;
  total: number;
}

export interface ApplicantsLicenseData {
  status: string;
  applicants: number;
}

export interface ApplicantsRecruitmentData {
  status: string;
  'First Nations Health': number;
  'Fraser Health': '1';
  'Interior Health': '0';
  'Vancouver Island Health': '0';
  'Northern Health': '0';
  'Providence Health': '0';
  'Provincial Health Services': '0';
  'Vancouver Coastal Health': '0';
}
