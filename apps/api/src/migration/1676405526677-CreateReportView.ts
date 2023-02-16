import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReportView1676405526677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW hired_withdrawn_applicants AS (
        (SELECT
          iasa.applicant_id AS id, 
          max(iasa.start_date) AS hired_date,
          CAST(NULL AS date) AS withdraw_date
        FROM public.ien_applicant_status_audit iasa
        LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
        WHERE ias.status = 'Job Offer Accepted'
        GROUP BY iasa.applicant_id)
        UNION ALL
        (SELECT
          iasa.applicant_id AS id, 
          CAST(NULL AS date) AS hired_date,
          max(iasa.start_date) AS withdraw_date
        FROM public.ien_applicant_status_audit iasa
        LEFT JOIN public.ien_applicant_status ias ON ias.id = iasa.status_id
        WHERE ias.status = 'Withdrew from IEN program'
        GROUP BY iasa.applicant_id)
      );
    `);
    await queryRunner.query(`
      CREATE OR REPLACE VIEW hired_withdrawn_applicant_milestone AS (
        SELECT
          hwa.*,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa WHERE asa.applicant_id = hwa.id) as milestone_start_date,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                'Applied to NNAS',
                'Submitted Documents (NNAS Application in Review)',
                'Received NNAS Report'
              )
            )
          ) as nnas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Applied to NNAS')        
          ) as applied_to_nnas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Submitted Documents (NNAS Application in Review)')   
          ) as submitted_documents,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Received NNAS Report')   
          ) as received_nnas_report,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                'Applied to BCCNM',
                'Completed English Language Requirement',
                'Referred to NCAS',
                'Completed Computer-Based Assessment (CBA)',
                'Completed Simulation Lab Assessment (SLA)',
                'Completed NCAS'
              )
            )
          ) as bccnm_ncas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Applied to BCCNM')   
          ) as applied_to_bccnm,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Completed English Language Requirement') 
          ) as completed_language_requirement,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Referred to NCAS')   
          ) as referred_to_ncas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Completed Computer-Based Assessment (CBA)')   
          ) as completed_cba,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Completed Simulation Lab Assessment (SLA)')   
          ) as completed_sla,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Completed NCAS')   
          ) as completed_ncas,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.category = 'IEN Recruitment Process'
            )
          ) as recruitment,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id IN (
                SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                  'Candidate Passed Pre-Screen',
                  'Candidate Did Not Pass Pre-Screen'
                )
              )
          ) as pre_screen,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id IN (
                SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                  'Candidate Passed Interview',
                  'Candidate Did Not Pass Interview'
                )
              )
          ) as interview,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id IN (
                SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                  'Candidate Passed Reference Check',
                  'Candidate Did Not Pass Reference Check'
                )
              )
          ) as reference_check,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id IN (
                SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                  'Job Offer Accepted',
                  'Job Offer Not Accepted',
                  'Job Competition Cancelled',
                  'HA is Not Interested',
                  'No Position Available',
                  'Candidate Withdrew from Competition'
                )
              )
          ) as competition_outcome,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id IN (
                SELECT ias.id FROM ien_applicant_status ias WHERE ias.category = 'BC PNP Process'
              )
          ) as immigration,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Sent First Steps document to candidate')   
          ) as sent_first_steps_document,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Sent employer documents to HMBC')   
          ) as sent_employer_documents_to_hmbc,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Submitted application to BC PNP')   
          ) as submitted_bc_pnp_application,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Received Confirmation of Nomination')   
          ) as received_confirmation_of_nomination,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Sent Second Steps document to candidate')   
          ) as sent_second_steps_document,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Submitted Work Permit Application')   
          ) as submitted_work_permit_application,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Received Work Permit Approval Letter')   
          ) as received_work_permit_approval_letter,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Received Work Permit (Arrival in Canada)')   
          ) as received_work_permit,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND
              asa.status_id = (SELECT ias.id FROM ien_applicant_status ias WHERE ias.status = 'Received Permanent Residency')   
          ) as received_pr,
          (SELECT min(start_date) FROM public.ien_applicant_status_audit asa
            WHERE asa.applicant_id = hwa.id AND asa.status_id IN (
              SELECT ias.id FROM ien_applicant_status ias WHERE ias.status IN (
                'Received Work Permit Approval Letter',
                'Received Work Permit (Arrival in Canada)',
                'Received Permanent Residency'
              )
            )
          ) as immigration_completed
        FROM hired_withdrawn_applicants hwa
      );
    `);
    await queryRunner.query(`
      CREATE OR REPLACE VIEW milestone_duration AS (
        SELECT
          id,
          hired_date,
          withdraw_date,
          (CASE WHEN nnas IS NOT null THEN
            (LEAST(bccnm_ncas, recruitment, immigration, hired_date, withdraw_date) - nnas)
          END) AS nnas,
          (CASE WHEN applied_to_nnas IS NOT null THEN
            (LEAST(submitted_documents, received_nnas_report, bccnm_ncas, recruitment, immigration, hired_date, withdraw_date) - applied_to_nnas)
          END) AS applied_to_nnas,
          (CASE WHEN submitted_documents IS NOT null THEN
            (LEAST(received_nnas_report, bccnm_ncas, recruitment, immigration, hired_date, withdraw_date) - submitted_documents)
          END) AS submitted_documents,
          (CASE WHEN received_nnas_report IS NOT null THEN
            (LEAST(bccnm_ncas, recruitment, immigration, hired_date, withdraw_date) - received_nnas_report)
          END) AS received_nnas_report,
          (CASE WHEN bccnm_ncas IS NOT null THEN
            (LEAST(recruitment, immigration, hired_date, withdraw_date) - bccnm_ncas)
          END) AS bccnm_ncas,
          (CASE WHEN applied_to_bccnm IS NOT null THEN
            (LEAST(completed_language_requirement, referred_to_ncas, completed_cba, completed_sla, completed_ncas, recruitment, immigration, hired_date, withdraw_date, CURRENT_DATE) - applied_to_bccnm)
          END) AS applied_to_bccnm,
          (CASE WHEN completed_language_requirement IS NOT null THEN
            (LEAST(referred_to_ncas, completed_cba, completed_sla, completed_ncas, recruitment, immigration, hired_date, withdraw_date) - completed_language_requirement)
          END) AS completed_language_requirement,
          (CASE WHEN referred_to_ncas IS NOT null THEN
            (LEAST(completed_cba, completed_sla, completed_ncas, recruitment, immigration, hired_date, withdraw_date) - referred_to_ncas)
          END) AS referred_to_ncas,
          (CASE WHEN completed_cba IS NOT null THEN
            (LEAST(completed_sla, completed_ncas, recruitment, immigration, hired_date, withdraw_date) - completed_cba)
          END) AS completed_cba,
          (CASE WHEN completed_sla IS NOT null THEN
            (LEAST(completed_ncas, recruitment, immigration, hired_date, withdraw_date) - completed_sla)
          END) AS completed_sla,
          (CASE WHEN completed_ncas IS NOT null THEN
            (LEAST(recruitment, immigration, hired_date, withdraw_date) - completed_ncas)
          END) AS completed_ncas,
          (CASE WHEN recruitment IS NOT null THEN
            (LEAST(immigration, hired_date, withdraw_date) - recruitment)
          END) AS recruitment,
          (CASE WHEN pre_screen  IS NOT null THEN
            (LEAST(interview, reference_check, competition_outcome, immigration, hired_date, withdraw_date) - pre_screen)
          END) AS pre_screen,
          (CASE WHEN interview  IS NOT null THEN
            (LEAST(reference_check, competition_outcome, immigration, hired_date, withdraw_date) - interview)
          END) AS interview,
          (CASE WHEN reference_check IS NOT null THEN
            (LEAST(competition_outcome, immigration, hired_date, withdraw_date) - reference_check)
          END) AS reference_check,
          (CASE WHEN competition_outcome IS NOT null THEN
            (LEAST(immigration, withdraw_date, CURRENT_DATE) - competition_outcome)
          END) AS competition_outcome,
          (CASE WHEN immigration IS NOT null THEN
            (LEAST(withdraw_date, immigration_completed, CURRENT_DATE) - immigration)
          END) AS immigration,
          (CASE WHEN sent_first_steps_document IS NOT null THEN
            (LEAST(withdraw_date, sent_employer_documents_to_hmbc, submitted_bc_pnp_application, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, CURRENT_DATE) - sent_first_steps_document)
          END) AS sent_first_steps_document,
          (CASE WHEN sent_employer_documents_to_hmbc IS NOT null THEN
            (LEAST(withdraw_date, submitted_bc_pnp_application, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, CURRENT_DATE) - sent_employer_documents_to_hmbc)
          END) AS sent_employer_documents_to_hmbc,
          (CASE WHEN submitted_bc_pnp_application IS NOT null THEN
            (LEAST(withdraw_date, received_confirmation_of_nomination, sent_second_steps_document, submitted_work_permit_application, immigration_completed, CURRENT_DATE) - submitted_bc_pnp_application)
          END) AS submitted_bc_pnp_application,
          (CASE WHEN received_confirmation_of_nomination IS NOT null THEN
            (LEAST(withdraw_date, sent_second_steps_document, submitted_work_permit_application, immigration_completed, CURRENT_DATE) - received_confirmation_of_nomination)
          END) AS received_confirmation_of_nomination,
          (CASE WHEN sent_second_steps_document IS NOT null THEN
            (LEAST(withdraw_date, submitted_work_permit_application, immigration_completed, CURRENT_DATE) - sent_second_steps_document)
          END) AS sent_second_steps_document,
          (CASE WHEN submitted_work_permit_application IS NOT null THEN
            (LEAST(withdraw_date, immigration_completed, CURRENT_DATE) - submitted_work_permit_application)
          END) AS submitted_work_permit_application,
          (CASE WHEN received_work_permit_approval_letter IS NOT null THEN
            (LEAST(withdraw_date, received_work_permit, received_pr, CURRENT_DATE) - received_work_permit_approval_letter)
          END) AS received_work_permit_approval_letter,
          (CASE WHEN received_work_permit IS NOT null THEN
            (LEAST(withdraw_date, received_pr, CURRENT_DATE) - received_work_permit)
          END) AS received_work_permit
        FROM hired_withdrawn_applicant_milestone
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropView('milestone_duration');
    await queryRunner.dropView('hired_withdrawn_applicant_milestone');
    await queryRunner.dropView('hired_withdrawn_applicants');
  }
}
