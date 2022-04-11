import {
  IENApplicantStatusRO,
  IENHaPcnRO,
  IENJobLocationRO,
  IENJobTitleRO,
  IENUserRO,
} from './ien.ro';

export interface ApplicantRO {
  id: string;
  name: string;
  applicant_id?: number;
  email_address?: string;
  phone_number?: string;
  registration_date?: Date;
  assigned_to?: JSON;
  country_of_citizenship?: string[];
  country_of_residence?: string;
  pr_status?: string;
  nursing_educations?: JSON;
  bccnm_license_number?: string;
  health_authorities?: JSON;
  notes?: JSON;
  status?: IENApplicantStatusRO;
  additional_data?: JSON;
  is_open: boolean;
  added_by: IENUserRO | null;
  updated_by?: IENUserRO | null;
  jobs?: ApplicantJobRO[] | null;
  applicant_status_audit?: ApplicantStatusAuditRO[] | null;
  applicant_audit?: ApplicantAuditRO[] | null;
  created_date?: Date;
  updated_date?: Date;
}

export interface ApplicantJobRO {
  id: string;
  ha_pcn: IENHaPcnRO;
  job_id?: string;
  job_title: IENJobTitleRO;
  job_location: IENJobLocationRO;
  recruiter_name?: string;
  job_post_date?: Date;
  added_by?: IENUserRO | null;
  applicant?: ApplicantRO | null;
  status_audit?: ApplicantStatusAuditRO[] | null;
  created_date?: Date;
  updated_date?: Date;
}

export interface ApplicantStatusAuditRO {
  id: number;
  status: IENApplicantStatusRO;
  job?: ApplicantJobRO | null;
  applicant: ApplicantRO;
  start_date?: Date;
  end_date?: Date;
  notes?: string;
  added_by?: IENUserRO | null;
  updated_by?: IENUserRO | null;
  created_date?: Date;
  updated_date?: Date;
}

export interface ApplicantAuditRO {
  id: number;
  applicant: ApplicantRO;
  data: JSON;
  created_date?: Date;
  added_by?: IENUserRO | null;
}