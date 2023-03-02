import { ViewColumn, ViewEntity } from 'typeorm';
import { HiredApplicantMilestoneEntity } from './hired-applicant-milestone.entity';

// the expression is given by reference
// because we don't sync schema and the view table should have been created by a migration
@ViewEntity({
  name: 'milestone_duration',
  expression: `
    SELECT
      id,
      registered_at,
      hired_at,
      withdrew_at,
      immigration_completed AS immigrated_at,
      ha,
      (
        CASE WHEN nnas IS NOT null THEN
          (COALESCE(received_nnas_report, bccnm_ncas, recruitment) - milestone_start_date)
        END
      ) AS nnas,
    
      (
        CASE WHEN applied_to_nnas IS NOT null THEN
          (applied_to_nnas - milestone_start_date)
        END
      ) AS applied_to_nnas,
      
      (
        CASE WHEN submitted_documents IS NOT null THEN
          (submitted_documents - COALESCE(applied_to_nnas, milestone_start_date))
        END
      ) AS submitted_documents,
      
      (
        CASE WHEN received_nnas_report IS NOT null THEN
          (received_nnas_report - COALESCE(submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS received_nnas_report,
      
      (
        CASE WHEN bccnm_ncas IS NOT null THEN
          (COALESCE(completed_ncas, recruitment) - COALESCE(received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS bccnm_ncas,
      
      (
        CASE WHEN applied_to_bccnm IS NOT null THEN
          (applied_to_bccnm - COALESCE(received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS applied_to_bccnm,
      
      (
        CASE WHEN completed_language_requirement IS NOT null THEN
          (completed_language_requirement - COALESCE(applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS completed_language_requirement,
      
      (
        CASE WHEN referred_to_ncas IS NOT null THEN
          (referred_to_ncas - COALESCE(completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS referred_to_ncas,
      
      (
        CASE WHEN completed_cba IS NOT null THEN
          (completed_cba - COALESCE(referred_to_ncas, completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS completed_cba,
      
      (
        CASE WHEN completed_sla IS NOT null THEN
          (completed_sla - COALESCE(completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS completed_sla,
      
      (
        CASE WHEN completed_ncas IS NOT null THEN
          (completed_ncas - COALESCE(completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS completed_ncas,
      
      (
        CASE WHEN recruitment IS NOT null THEN
          (hired_at - COALESCE(completed_ncas, completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS recruitment,
      
      (
        CASE WHEN pre_screen  IS NOT null THEN
          (pre_screen - COALESCE(completed_ncas, completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, received_nnas_report, submitted_documents, applied_to_nnas, milestone_start_date))
        END
      ) AS pre_screen,
      
      (
        CASE WHEN interview  IS NOT null THEN
          (interview - COALESCE(pre_screen, completed_ncas, completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, applied_to_nnas, submitted_documents, received_nnas_report, milestone_start_date))
        END
      ) AS interview,
      
      (
        CASE WHEN reference_check IS NOT null THEN
          (reference_check - COALESCE(interview, pre_screen, completed_ncas, completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, applied_to_nnas, submitted_documents, received_nnas_report, milestone_start_date))
        END
      ) AS reference_check,
      
      (
        hired_at - COALESCE(reference_check, interview, pre_screen, completed_ncas, completed_sla, completed_cba, referred_to_ncas, completed_language_requirement, applied_to_bccnm, applied_to_nnas, submitted_documents, received_nnas_report, milestone_start_date)
      ) AS hired,
      
      (
        CASE WHEN immigration IS NOT null THEN
          (COALESCE(immigration_completed, CURRENT_DATE) - hired_at)
        END
      ) AS immigration,
      
      (
        CASE WHEN sent_first_steps_document IS NOT null THEN
          (sent_first_steps_document - hired_at)
        END
      ) AS sent_first_steps_document,
      
      (
        CASE WHEN sent_employer_documents_to_hmbc IS NOT null THEN
          (sent_employer_documents_to_hmbc - COALESCE(sent_first_steps_document, hired_at))
        END
      ) AS sent_employer_documents_to_hmbc,
      
      (
        CASE WHEN submitted_bc_pnp_application IS NOT null THEN
          (submitted_bc_pnp_application - COALESCE(sent_employer_documents_to_hmbc, sent_first_steps_document, hired_at))
        END
      ) AS submitted_bc_pnp_application,
      
      (
        CASE WHEN received_confirmation_of_nomination IS NOT null THEN
          (received_confirmation_of_nomination - COALESCE(submitted_bc_pnp_application, sent_employer_documents_to_hmbc, sent_first_steps_document, hired_at))
        END
      ) AS received_confirmation_of_nomination,
      
      (
        CASE WHEN sent_second_steps_document IS NOT null THEN
          (sent_second_steps_document - COALESCE(received_confirmation_of_nomination, submitted_bc_pnp_application, sent_employer_documents_to_hmbc, sent_first_steps_document, hired_at))
        END
      ) AS sent_second_steps_document,
      
      (
        CASE WHEN submitted_work_permit_application IS NOT null THEN
          (submitted_work_permit_application - COALESCE(sent_second_steps_document, received_confirmation_of_nomination, submitted_bc_pnp_application, sent_employer_documents_to_hmbc, sent_first_steps_document, hired_at))
        END
      ) AS submitted_work_permit_application,
      
      (
        CASE WHEN immigration_completed IS NOT null THEN
          (immigration_completed - COALESCE(submitted_work_permit_application, sent_second_steps_document, received_confirmation_of_nomination, submitted_bc_pnp_application, sent_employer_documents_to_hmbc, sent_first_steps_document, hired_at))
        END
      ) AS immigration_completed,
  
      (hired_at - milestone_start_date) AS to_hire,
      
      (
        CASE WHEN immigration_completed IS NOT null THEN
          (immigration_completed - milestone_start_date)
        END
      ) AS overall
    FROM hired_applicant_milestone
  `,
  dependsOn: [HiredApplicantMilestoneEntity],
})
export class MilestoneDurationEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  hired_at!: Date;

  @ViewColumn()
  withdrew_at!: Date;

  @ViewColumn()
  immigrated_at!: Date;

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

  @ViewColumn()
  to_hire!: number;

  @ViewColumn()
  overall!: number;
}
