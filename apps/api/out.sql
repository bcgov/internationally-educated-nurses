
      WITH active_applicants AS (
        SELECT
          t1.*,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '632374e6-ca2f-0baa-f994-3a05e77c118a'
          ) AS full_lpn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '18aa32c3-a6a4-4431-8283-89931c141fde'
          ) AS full_rn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = '91f55faa-c71d-83c8-4f10-3a05e778afbc'
          ) AS prov_lpn,
          (
            SELECT count(*)
            FROM public.ien_applicant_status_audit sa 
            WHERE sa.applicant_id=t1.id AND sa.status_id = 'd2656957-ec58-15c9-1e21-3a05e778dc8e'
          ) AS prov_rn
        FROM (
          SELECT 
          applicants.id,
          CASE 
            WHEN 
              COALESCE(
                (
                  SELECT ien_status.status_id 
                  FROM public.ien_applicant_status_audit ien_status
                  LEFT JOIN public.ien_applicant_status status ON status.id = ien_status.status_id
                  WHERE
                    ien_status.applicant_id = applicants.id AND ien_status.start_date::date <= '2023-01-01' AND
                    status.category IN ('IEN Licensing/Registration Process', 'IEN Recruitment Process')
                  ORDER BY ien_status.start_date DESC, ien_status.updated_date DESC
                  LIMIT 1
                ),
                '00000000-0000-0000-0000-000000000000'
              ) IN ('f84a4167-a636-4b21-977c-f11aefc486af', '70b1f5f1-1a0d-ef71-42ea-3a0601b46bc2') 
            THEN 1
            ELSE 0 
          END as hired_or_withdrawn
          FROM public.ien_applicants as applicants
        ) as t1
        WHERE t1.hired_or_withdrawn = 0
      ),
      period_data AS (
        SELECT
          aa.*,
          b.applicant_id,
          b.status_id as status_id
        FROM active_applicants aa
        LEFT JOIN LATERAL (
          SELECT 
            status_audit.applicant_id,
            status_audit.status_id
          FROM public.ien_applicant_status_audit status_audit
          LEFT JOIN public.ien_applicant_status status ON status.id = status_audit.status_id
          WHERE 
            start_date::date >= '2000-01-01' AND
            start_date::date <= '2023-01-01' AND
            aa.id = status_audit.applicant_id AND
            status.category = 'IEN Licensing/Registration Process'
          ORDER BY start_date desc, updated_date desc
          limit 1
        ) b ON aa.id=b.applicant_id
      ),
      report AS (
        SELECT * FROM period_data WHERE status_id IS NOT NULL
      )
      




      
      SELECT 'Applied to NNAS' as status, count(*) as applicants
      FROM report WHERE status_id IN (
        'e68f902c-8440-4a9c-a05f-2765301de800',
        '897156c7-958c-4ec0-879a-ed4943af7b72',
        '20268c6e-145e-48cd-889a-2346985db957'
      ) UNION ALL
      SELECT 'Applied to BCCNM' as status, count(*)
      FROM report WHERE status_id = '8a9b0d13-f5d7-4be3-8d38-11e5459f9e9a' UNION ALL
      
      SELECT 'Completed English Language Requirement' as status, count(*)
      FROM report WHERE status_id = 'da06889e-55a1-4ff2-9984-80ae23d7e44b' UNION ALL
      
      SELECT 'Referred to NCAS' as status, count(*)
      FROM report WHERE status_id IN (
        'ead2e076-df00-4dab-a0cc-5a7f0bafc51a',
        '61150e8a-6e83-444a-9dab-3129a8cc0719',
        '9066b792-6fbf-4e60-803f-0554e4b4dba9'
      ) UNION ALL
      
      SELECT 'Completed NCAS' as status, count(*)
      FROM report WHERE status_id = '06e2d762-05ba-4667-93d2-7843d3cf9fc5' UNION ALL
      
      SELECT 'Completed Additional Education' as status, count(*)
      FROM report WHERE status_id IN (
        '8024ed3a-803f-4e34-9934-c29565daaf63',
        '59263418-77ea-411f-894d-c84b5e1f710f'
      ) UNION ALL

      SELECT 'NCLEX - Written' as status, count(*)
      FROM report WHERE status_id = '0d6bcfe1-fb00-45cb-a9c6-c6a53da12e62' UNION ALL
      
      SELECT 'NCLEX - Passed' as status, count(*)
      FROM report WHERE status_id = 'b0d38aa5-b776-4033-97f7-9894e9b33a3c' UNION ALL
      
      SELECT 'REx-PN – Written' as status, count(*)
      FROM report WHERE status_id = 'd9ad22cd-7629-67ea-5734-3a05e77a47f6' UNION ALL
      
      SELECT 'REx-PN – Passed' as status, count(*)
      FROM report WHERE status_id = '36b0cacf-acd1-6bc5-3e4c-3a05e77a79c9' UNION ALL
      
      SELECT 'BCCNM Full Licence LPN' as status, count(*)
      FROM report WHERE status_id = '632374e6-ca2f-0baa-f994-3a05e77c118a' UNION ALL
      
      SELECT 'BCCNM Full Licence RN' as status, count(*)
      FROM report WHERE status_id = '18aa32c3-a6a4-4431-8283-89931c141fde' UNION ALL
      
      SELECT 'BCCNM Provisional Licence LPN' as status, count(*)
      FROM report WHERE status_id = '91f55faa-c71d-83c8-4f10-3a05e778afbc' UNION ALL
      
      SELECT 'BCCNM Provisional Licence RN' as status, count(*)
      FROM report WHERE status_id = 'd2656957-ec58-15c9-1e21-3a05e778dc8e' UNION ALL
      
      SELECT 'Referred for registration exam' as status, count(*)
      FROM report WHERE status_id = '4189ca04-c1e1-4c22-9d6b-8afd80130313' UNION ALL
      
      SELECT 'Registered as an HCA' as status, count(*)
      FROM report WHERE status_id = 'ca858996-d1ad-2fe3-d8d3-3a05e77c9a2a' UNION ALL
      
      SELECT 'Registration Journey Complete' as status, count(*)
      FROM report WHERE status_id = '5b4173e1-e750-9b85-9464-3a05e77d4547' UNION ALL
      
      SELECT 'Withdrew from IEN program' as status, count(*)
      FROM report WHERE status_id = 'f84a4167-a636-4b21-977c-f11aefc486af' UNION ALL
      
      SELECT 'Applicant ready for job search' as status, count(*)
      FROM report WHERE status_id = 'b93e7bf6-5f2b-43fd-b4b7-58c42aa02bfa' UNION ALL
      
      SELECT 'Applicant Referred to FNHA' as status, count(*)
      FROM report WHERE status_id = '73a4b092-ae7e-de91-17e1-3a05e7864830' UNION ALL
        
      SELECT 'Applicant Referred to FHA' as status, count(*)
      FROM report WHERE status_id = 'dfcfa87a-40f9-ec41-2afa-3a0601a9ce32' UNION ALL
        
      SELECT 'Applicant Referred to IHA' as status, count(*)
      FROM report WHERE status_id = 'b5452d40-7dfd-d614-0319-3a0601aa0749' UNION ALL
        
      SELECT 'Applicant Referred to NHA' as status, count(*)
      FROM report WHERE status_id = '9e97a1b3-a48e-3fb0-082c-3a0601aa2678' UNION ALL
        
      SELECT 'Applicant Referred to PHC' as status, count(*)
      FROM report WHERE status_id = 'e5f02166-36cb-12a8-a5ba-3a0601aa5aed' UNION ALL
        
      SELECT 'Applicant Referred to PHSA' as status, count(*)
      FROM report WHERE status_id = '42054107-17fb-e6e7-eb58-3a0601aa8dd3' UNION ALL
        
      SELECT 'Applicant Referred to VCHA' as status, count(*)
      FROM report WHERE status_id = '26069c6c-a5b8-a2ac-c94d-3a0601aab009' UNION ALL
        
      SELECT 'Applicant Referred to VIHA' as status, count(*)
      FROM report WHERE status_id = '001dfb24-1618-e975-6578-3a0601aac804' UNION ALL
             
      SELECT 'Granted full licensure' as status, count(*)
      FROM report WHERE (full_rn + full_lpn) > 0 UNION ALL
      SELECT 'Granted provisional licensure' as status, count(*)
      FROM report WHERE (prov_rn + prov_lpn) > 0 and (full_rn + full_lpn) = 0;
      