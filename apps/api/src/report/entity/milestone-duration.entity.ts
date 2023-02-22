import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'milestone_duration',
})
export class MilestoneDurationEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  hired_at!: Date;

  @ViewColumn()
  withdrew_at!: Date;

  @ViewColumn()
  nnas!: number;

  @ViewColumn()
  applied_to_nnas!: number;

  @ViewColumn()
  submitted_documents!: number;

  @ViewColumn()
  received_nnas_report!: number;

  @ViewColumn()
  bccnm_ncas!: number;

  @ViewColumn()
  applied_to_bccnm!: number;

  @ViewColumn()
  completed_language_requirement!: number;

  @ViewColumn()
  referred_to_ncas!: number;

  @ViewColumn()
  completed_cba!: number;

  @ViewColumn()
  completed_sla!: number;

  @ViewColumn()
  completed_ncas!: number;

  @ViewColumn()
  recruitment!: number;

  @ViewColumn()
  pre_screen!: number;

  @ViewColumn()
  interview!: number;

  @ViewColumn()
  reference_check!: number;

  @ViewColumn()
  hired!: number;

  @ViewColumn()
  immigration!: number;

  @ViewColumn()
  sent_first_steps_document!: number;

  @ViewColumn()
  sent_employer_documents_to_hmbc!: number;

  @ViewColumn()
  submitted_bc_pnp_application!: number;

  @ViewColumn()
  received_confirmation_of_nomination!: number;

  @ViewColumn()
  sent_second_steps_document!: number;

  @ViewColumn()
  submitted_work_permit_application!: number;

  @ViewColumn()
  immigration_completed!: number;
}
