import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'hired_withdrawn_applicant_milestone',
})
export class HiredWithdrawnApplicantMilestoneEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  hired_date!: Date;

  @ViewColumn()
  withdraw_date!: Date;

  @ViewColumn()
  nnas!: Date;

  @ViewColumn()
  applied_to_nnas!: Date;

  @ViewColumn()
  submitted_documents!: Date;

  @ViewColumn()
  received_nnas_report!: Date;

  @ViewColumn()
  bccnm_ncas!: Date;

  @ViewColumn()
  applied_to_bccnm!: Date;

  @ViewColumn()
  completed_language_requirement!: Date;

  @ViewColumn()
  referred_to_ncas!: Date;

  @ViewColumn()
  completed_cba!: Date;

  @ViewColumn()
  completed_sla!: Date;

  @ViewColumn()
  completed_ncas!: Date;

  @ViewColumn()
  recruitment!: Date;

  @ViewColumn()
  pre_screen!: Date;

  @ViewColumn()
  interview!: Date;

  @ViewColumn()
  reference_check!: Date;

  @ViewColumn()
  competition_outcome!: Date;

  @ViewColumn()
  immigration!: Date;

  @ViewColumn()
  sent_first_steps_document!: Date;

  @ViewColumn()
  sent_employer_documents_to_hmbc!: Date;

  @ViewColumn()
  submitted_bc_pnp_application!: Date;

  @ViewColumn()
  received_confirmation_of_nomination!: Date;

  @ViewColumn()
  sent_second_steps_document!: Date;

  @ViewColumn()
  submitted_work_permit_application!: Date;

  @ViewColumn()
  received_work_permit_approval_letter!: Date;

  @ViewColumn()
  received_work_permit!: Date;

  @ViewColumn()
  received_pr!: Date;

  @ViewColumn()
  immigration_completed!: Date;
}
