export interface JobFilterOptions {
  ha_pcn?: number[];
  job_title?: number[];
}

export interface JobQueryOptions extends JobFilterOptions {
  job_id?: number;
  skip?: number;
  limit?: number;
}
