import { NursingEducationDTO } from '../dto';
import {
  IENApplicantStatusRO,
  IENHaPcnRO,
  IENJobLocationRO,
  IENJobTitleRO,
  IENStatusReasonRO,
  IENUserRO,
} from './ien.ro';
import { END_OF_JOURNEY_FLAG, IenType } from '../enum';
import { EmployeeRO } from './employee.ro';

export interface ApplicantRO {
  id: string;
  name: string;
  ats1_id?: string;
  email_address?: string;
  phone_number?: string;
  registration_date?: Date;
  assigned_to?: IENUserRO[];
  country_of_citizenship?: string[];
  country_of_residence?: string;
  pr_status?: string;
  nursing_educations?: NursingEducationDTO[];
  bccnm_license_number?: string;
  notes?: JSON;
  status?: IENApplicantStatusRO;
  additional_data?: JSON;
  is_open: boolean;
  new_bccnm_process: boolean;
  added_by: IENUserRO | null;
  updated_by?: IENUserRO | null;
  jobs?: ApplicantJobRO[] | null;
  applicant_status_audit?: ApplicantStatusAuditRO[] | null;
  applicant_audit?: ApplicantAuditRO[] | null;
  recruiters?: EmployeeRO[] | null;
  active_flags?: ApplicantActiveFlagRO[];
  pathway?: PathwayRO;
  end_of_journey?: END_OF_JOURNEY_FLAG | null;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date | null;
  deleted_by?: EmployeeRO | null;
}

export interface ApplicantJobRO {
  id: string;
  ha_pcn: IENHaPcnRO;
  job_id?: string;
  job_title?: IENJobTitleRO | null;
  job_location?: IENJobLocationRO[] | null;
  job_post_date?: Date;
  added_by?: IENUserRO | null;
  applicant?: ApplicantRO | null;
  status_audit?: ApplicantStatusAuditRO[] | null;
  created_date?: Date;
  updated_date?: Date;
}

export interface ApplicantStatusAuditRO {
  id: string;
  status: IENApplicantStatusRO;
  job?: ApplicantJobRO | null;
  applicant: ApplicantRO;
  start_date?: string;
  notes?: string;
  added_by?: IENUserRO;
  updated_by?: IENUserRO;
  created_date: string;
  updated_date: string;
  reason?: IENStatusReasonRO;
  reason_other?: string;
  effective_date?: string;
  type?: IenType;
}

export interface ApplicantAuditRO {
  id: number;
  applicant: ApplicantRO;
  data: JSON;
  created_date?: Date;
  added_by?: IENUserRO | null;
}
export interface ApplicantActiveFlagRO {
  applicant_id: string;
  ha_id: string;
  is_active: boolean;
  status?: string;
}

export interface PathwayRO {
  id: string;
  name: string;
}
