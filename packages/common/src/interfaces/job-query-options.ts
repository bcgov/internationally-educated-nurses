export interface JobFilterOptions {
  ha_pcn?: string[];
  job_title?: string[];
}

export interface JobQueryOptions extends JobFilterOptions {
  job_id?: number;
  skip?: number;
  limit?: number;
}
