import { IENApplicantStatusAudit } from '../entity/ienapplicant-status-audit.entity';

export interface ApplicantSyncRO {
  id: string;
  updated_date: Date;
  milestone_statuses: IENApplicantStatusAudit[];
}
