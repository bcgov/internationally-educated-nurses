import { END_OF_JOURNEY_FLAG } from '@ien/common';
import { IENHaPcn } from '../entity/ienhapcn.entity';

export interface EmployeeSync {
  id?: string;
  name?: string;
  email?: string;
  user_id?: string;
}
export interface JobSync {
  id: string;
  job_id?: string;
  job_post_date?: Date; // format YYYY-MM-DD
  created_date: Date; // format YYYY-MM-DDThh:mm:ss.sss
  updated_date: Date; // format YYYY-MM-DDThh:mm:ss.sss
  ha_pcn: IENHaPcn;
}

export interface AdditionalData {
  job: JobSync;
  reason?: string;
  effective_date?: Date; // format YYYY-MM-DD
  reason_other?: string;
  type?: string;
  added_by?: EmployeeSync;
  updated_by?: EmployeeSync;
  notes?: string;
}

export interface MilestoneSync {
  id: string;
  start_date?: Date; // format YYYY-MM-DD
  created_date: Date; // format YYYY-MM-DDThh:mm:ss.sss
  updated_date: Date; // format YYYY-MM-DDThh:mm:ss.sss
  additional_data: AdditionalData | null;
  status: string; // Id to the status
}

export interface ApplicantSyncRO {
  id: string;
  updated_date: Date;
  end_of_journey?: END_OF_JOURNEY_FLAG | boolean | null;
  milestone_statuses: MilestoneSync[];
}
