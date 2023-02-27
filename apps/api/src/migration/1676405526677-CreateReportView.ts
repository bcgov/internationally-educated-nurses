import _ from 'lodash';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { STATUS } from '@ien/common';

export class CreateReportView1676405526677 implements MigrationInterface {
  private async getStatusMap(queryRunner: QueryRunner): Promise<Record<string, string>> {
    const result = await queryRunner.query(`SELECT id, status FROM ien_applicant_status`);
    return _.chain(result).keyBy('status').mapValues('id').value();
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const STATUS_ID = await this.getStatusMap(queryRunner);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW hired_applicant AS (
        SELECT
          a.id,
          min(ia.registration_date) AS registered_at,
          max(a.hired_at) AS hired_at,
          max(a.withdrew_at) AS withdrew_at,
          ihp.title AS ha,
          a.job_id
        FROM (
          (
            SELECT
              iasa.applicant_id AS id,
              max(iasa.start_date) AS hired_at,
              CAST(NULL AS date) AS withdrew_at,
              iasa.job_id AS job_id
            FROM public.ien_applicant_status_audit iasa
            LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
            WHERE ias.id = '${STATUS_ID[STATUS.JOB_OFFER_ACCEPTED]}'
            GROUP BY iasa.applicant_id, iasa.job_id
          )
          UNION ALL
          (
            SELECT
              iasa.applicant_id AS id,
              CAST(NULL AS date) AS hired_at,
              max(iasa.start_date) AS withdrew_at,
              iasa.job_id AS job_id
            FROM public.ien_applicant_status_audit iasa
            LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
            WHERE ias.id = '${STATUS_ID[STATUS.WITHDREW_FROM_PROGRAM]}'
            GROUP BY iasa.applicant_id, iasa.job_id
          )
        ) as a
        LEFT JOIN ien_applicants ia ON a.id = ia.id
        LEFT JOIN ien_applicant_jobs iaj ON iaj.id = a.job_id
        LEFT JOIN ien_ha_pcn ihp ON ihp.id = iaj.ha_pcn_id
        GROUP BY a.id, ihp.title, a.job_id
      );
    `);
    await queryRunner.query(`
      CREATE OR REPLACE VIEW hired_applicant_milestone AS (
        SELECT
          hwa.*,
          (
            SELECT LEAST(min(start_date), hwa.registered_at)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id
          ) as milestone_start_date,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              '${STATUS_ID[STATUS.APPLIED_TO_NNAS]}',
              '${STATUS_ID[STATUS.SUBMITTED_DOCUMENTS]}',
              '${STATUS_ID[STATUS.RECEIVED_NNAS_REPORT]}'
            )
          ) as nnas,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.APPLIED_TO_NNAS]
            }'        
          ) as applied_to_nnas,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SUBMITTED_DOCUMENTS]
            }' 
          ) as submitted_documents,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.RECEIVED_NNAS_REPORT]
            }'   
          ) as received_nnas_report,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              '${STATUS_ID[STATUS.APPLIED_TO_BCCNM]}',
              '${STATUS_ID[STATUS.COMPLETED_LANGUAGE_REQUIREMENT]}',
              '${STATUS_ID[STATUS.REFERRED_TO_NCAS]}',
              '${STATUS_ID[STATUS.COMPLETED_CBA]}',
              '${STATUS_ID[STATUS.COMPLETED_SLA]}',
              '${STATUS_ID[STATUS.COMPLETED_NCAS]}'
            )
          ) as bccnm_ncas,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.APPLIED_TO_BCCNM]
            }'   
          ) as applied_to_bccnm,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.COMPLETED_LANGUAGE_REQUIREMENT]
            }' 
          ) as completed_language_requirement,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.REFERRED_TO_NCAS]
            }'   
          ) as referred_to_ncas,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.COMPLETED_CBA]
            }'   
          ) as completed_cba,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.COMPLETED_SLA]
            }'   
          ) as completed_sla,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.COMPLETED_NCAS]
            }'   
          ) as completed_ncas,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.category = 'IEN Recruitment Process'
            )
          ) as recruitment,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.job_id = hwa.job_id AND asa.status_id IN (
              '${STATUS_ID[STATUS.PRE_SCREEN_PASSED]}',
              '${STATUS_ID[STATUS.PRE_SCREEN_NOT_PASSED]}'
            )
          ) as pre_screen,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.job_id = hwa.job_id AND asa.status_id IN (
              '${STATUS_ID[STATUS.INTERVIEW_PASSED]}',
              '${STATUS_ID[STATUS.INTERVIEW_NOT_PASSED]}'
            )
          ) as interview,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.job_id = hwa.job_id AND asa.status_id IN (
              '${STATUS_ID[STATUS.REFERENCE_CHECK_PASSED]}',
              '${STATUS_ID[STATUS.REFERENCE_CHECK_NOT_PASSED]}'
            )
          ) as reference_check,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.job_id = hwa.job_id AND asa.status_id IN (
              '${STATUS_ID[STATUS.JOB_OFFER_ACCEPTED]}',
              '${STATUS_ID[STATUS.JOB_OFFER_NOT_ACCEPTED]}',
              '${STATUS_ID[STATUS.JOB_COMPETITION_CANCELLED]}',
              '${STATUS_ID[STATUS.HA_NOT_INTERESTED]}',
              '${STATUS_ID[STATUS.NO_POSITION_AVAILABLE]}',
              '${STATUS_ID[STATUS.WITHDREW_FROM_COMPETITION]}'
            )
          ) as competition_outcome,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.category = 'BC PNP Process'
            )
          ) as immigration,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SENT_FIRST_STEPS_DOCUMENT]
            }'   
          ) as sent_first_steps_document,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SENT_EMPLOYER_DOCUMENTS_TO_HMBC]
            }'
          ) as sent_employer_documents_to_hmbc,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SUBMITTED_BC_PNP_APPLICATION]
            }'   
          ) as submitted_bc_pnp_application,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.RECEIVED_CONFIRMATION_OF_NOMINATION]
            }'   
          ) as received_confirmation_of_nomination,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SENT_SECOND_STEPS_DOCUMENT]
            }'   
          ) as sent_second_steps_document,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id = '${
              STATUS_ID[STATUS.SUBMITTED_WORK_PERMIT_APPLICATION]
            }'   
          ) as submitted_work_permit_application,
          
          (
            SELECT min(start_date)
            FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              '${STATUS_ID[STATUS.RECEIVED_WORK_PERMIT_APPROVAL_LETTER]}',
              '${STATUS_ID[STATUS.RECEIVED_WORK_PERMIT]}',
              '${STATUS_ID[STATUS.RECEIVED_PR]}'
            )
          ) as immigration_completed
        FROM hired_applicant hwa
        WHERE hwa.hired_at > hwa.withdrew_at OR hwa.withdrew_at IS NULL
      );
    `);
    await queryRunner.query(`
      CREATE OR REPLACE VIEW milestone_duration AS (
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
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropView('milestone_duration');
    await queryRunner.dropView('hired_applicant_milestone');
    await queryRunner.dropView('hired_applicant');
  }
}
