import { NursingEducation } from './nursing-education';
import { AtsMilestone } from './ats-milestone';
import { IENUserRO } from '../ro';

export interface AtsApplicant {
  applicant_id: string;
  assigned_to: IENUserRO[] | undefined;
  ats1_id: number;
  bccnm_license_number: string;
  countries_of_citizenship: string[] | string;
  country_of_residence: string;
  created_date: string;
  email_address: string;
  first_name: string;
  last_name: string;
  new_bccnm_process: boolean;
  notes: JSON;
  nursing_educations?: NursingEducation[];
  milestones?: AtsMilestone[];
  pathway_id: string;
  phone_number: string;
  pr_status: string;
  registration_date: string;
  updated_date: string;
}
