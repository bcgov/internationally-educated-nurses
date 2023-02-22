import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'hired_withdrawn_applicant',
})
export class HiredWithdrawnApplicantEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  hired_at!: Date;

  @ViewColumn()
  withdrew_at!: Date;
}
