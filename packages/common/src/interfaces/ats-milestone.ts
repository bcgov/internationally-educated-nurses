export interface AtsMilestone {
  id: string;
  name: string;
  category?: string;
  'process-related'?: boolean;
  start_date?: string;
  created_date?: string;
  notes?: string;
  added_by?: number;
  reason_id?: string;
  reason_other?: string;
  effective_date?: string;
}
