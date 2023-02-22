import { ViewColumn, ViewEntity } from 'typeorm';
import { HiredApplicantEntity } from './hired-applicant.entity';

// the expression is given by reference
// because we don't sync schema and the view table should have been created by a migration
@ViewEntity({
  name: 'hired_applicant_milestone',
  expression: `
    SELECT
      hwa.id,
        hwa.registered_at,
        hwa.hired_at,
        hwa.withdrew_at,
        hwa.ha,
        (
          SELECT
            LEAST(min(asa.start_date), hwa.registered_at) AS "least"
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
        ) AS milestone_start_date,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['e68f902c-8440-4a9c-a05f-2765301de800'::uuid,
            '897156c7-958c-4ec0-879a-ed4943af7b72'::uuid,
            '20268c6e-145e-48cd-889a-2346985db957'::uuid]))
        ) AS nnas,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'e68f902c-8440-4a9c-a05f-2765301de800'::uuid
        ) AS applied_to_nnas,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '897156c7-958c-4ec0-879a-ed4943af7b72'::uuid
        ) AS submitted_documents,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '20268c6e-145e-48cd-889a-2346985db957'::uuid
        ) AS received_nnas_report,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['8a9b0d13-f5d7-4be3-8d38-11e5459f9e9a'::uuid,
            'da06889e-55a1-4ff2-9984-80ae23d7e44b'::uuid,
            'ead2e076-df00-4dab-a0cc-5a7f0bafc51a'::uuid,
            '61150e8a-6e83-444a-9dab-3129a8cc0719'::uuid,
            '9066b792-6fbf-4e60-803f-0554e4b4dba9'::uuid,
            '06e2d762-05ba-4667-93d2-7843d3cf9fc5'::uuid]))
        ) AS bccnm_ncas,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '8a9b0d13-f5d7-4be3-8d38-11e5459f9e9a'::uuid
        ) AS applied_to_bccnm,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'da06889e-55a1-4ff2-9984-80ae23d7e44b'::uuid
        ) AS completed_language_requirement,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'ead2e076-df00-4dab-a0cc-5a7f0bafc51a'::uuid
        ) AS referred_to_ncas,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '61150e8a-6e83-444a-9dab-3129a8cc0719'::uuid
        ) AS completed_cba,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '9066b792-6fbf-4e60-803f-0554e4b4dba9'::uuid
        ) AS completed_sla,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '06e2d762-05ba-4667-93d2-7843d3cf9fc5'::uuid
        ) AS completed_ncas,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id IN (
              SELECT
                ias.id
              FROM
                ien_applicant_status ias
              WHERE
                ias.category::TEXT = 'IEN Recruitment Process'::TEXT
            ))
        ) AS recruitment,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['db964868-9eeb-e34d-9992-3a0601b2382c'::uuid,
            '66d4ec85-6a28-87fd-0aaa-3a0601b26edd'::uuid]))
        ) AS pre_screen,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['bd91e596-8f9a-0c98-8b9c-3a0601b2a18b'::uuid,
            '91c06396-a8f3-4d10-5a09-3a0601b2c98e'::uuid]))
        ) AS interview,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['d875b680-f027-46b7-05a5-3a0601b3a0e1'::uuid,
            '4f5e371e-f05e-a374-443f-3a0601b3eede'::uuid]))
        ) AS reference_check,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2'::uuid,
            'fc048e66-0173-fa1a-d0d2-3a0601b4ea3a'::uuid,
            '22ea1aa6-78b7-ecb6-88a7-3a0601b53b20'::uuid,
            '9b40266e-93c8-d827-b7cb-3a0601b593e0'::uuid,
            'b8ba04a8-148e-ab32-7eb9-3a0601b5b5af'::uuid,
            '3fd4f2b0-5151-d7c8-6bbc-3a0601b5e1b0'::uuid]))
        ) AS competition_outcome,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id IN (
              SELECT
                ias.id
              FROM
                ien_applicant_status ias
              WHERE
                ias.category::TEXT = 'BC PNP Process'::TEXT
            ))
        ) AS immigration,
          
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '4d435c42-f588-4174-bb1e-1fe086b23214'::uuid
        ) AS sent_first_steps_document,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '1651cad1-1e56-4c79-92ce-f548ad9ec52c'::uuid
        ) AS sent_employer_documents_to_hmbc,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'f3369599-1749-428b-a35d-562f92782e1c'::uuid
        ) AS submitted_bc_pnp_application,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = '3ef75425-42eb-4cc2-8a27-c9726f6f55fa'::uuid
        ) AS received_confirmation_of_nomination,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'da813b28-f617-4b5c-8e05-84f0ae3c9429'::uuid
        ) AS sent_second_steps_document,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND asa.status_id = 'f2008e2f-5f44-4f4c-80b4-f4ad284e9938'::uuid
        ) AS submitted_work_permit_application,
        
        (
          SELECT
            min(asa.start_date) AS min
          FROM
            ien_applicant_status_audit asa
          WHERE
            asa.applicant_id = hwa.id
            AND (asa.status_id = ANY (ARRAY['caa18ecd-fea5-459e-af27-bca15ac26133'::uuid,
            'e768029b-4ba1-4147-94f8-29587c6bb650'::uuid,
            '74173fde-b057-42da-b2ba-327bde532d2d'::uuid]))
        ) AS immigration_completed
    FROM
      hired_applicant hwa
    WHERE
      hwa.hired_at > hwa.withdrew_at
      OR hwa.withdrew_at IS NULL;
  `,
  dependsOn: [HiredApplicantEntity],
})
export class HiredApplicantMilestoneEntity {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  registered_at!: Date;

  @ViewColumn()
  hired_at!: Date;

  @ViewColumn()
  withdrew_at!: Date;

  @ViewColumn()
  ha!: string;

  @ViewColumn()
  milestone_start_date!: Date;

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
  immigration_completed!: Date;
}
