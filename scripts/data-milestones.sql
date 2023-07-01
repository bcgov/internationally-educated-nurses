INSERT INTO public.ien_applicant_status_audit
    (start_date, created_date, updated_date, status_id, applicant_id, added_by_id, updated_by_id, job_id, notes, reason_other, effective_date, reason_id)
VALUES
    ('2020-01-01', '2022-03-22 00:02:46.410144', '2022-06-22 00:02:53.20103', 'DB964868-9EEB-E34D-9992-3A0601B2382C', 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368', (SELECT id from ien_users where name = 'ien_e2e'), NULL, '86d9635b-785a-4b32-9a0f-3debfc09c0eb', 'first milestone', NULL, NULL, NULL),
    ('2020-02-01', '2022-04-22 00:02:53.181507', '2022-06-22 00:03:00.337995', 'BD91E596-8F9A-0C98-8B9C-3A0601B2A18B', 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368', (SELECT id from ien_users where name = 'ien_e2e'), NULL, '86d9635b-785a-4b32-9a0f-3debfc09c0eb', 'second milestone', NULL, NULL, NULL),
    ('2020-03-01', '2022-05-22 00:03:00.320119', '2022-06-22 00:03:06.686959', 'D875B680-F027-46B7-05A5-3A0601B3A0E1', 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368', (SELECT id from ien_users where name = 'ien_e2e'), NULL, '86d9635b-785a-4b32-9a0f-3debfc09c0eb', 'third milestone', NULL, NULL, NULL),
    ('2020-04-01', '2022-06-22 00:03:06.663323', '2022-06-22 00:03:06.663323', '70B1F5F1-1A0D-EF71-42EA-3A0601B46BC2', 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368', (SELECT id from ien_users where name = 'ien_e2e'), NULL, '86d9635b-785a-4b32-9a0f-3debfc09c0eb', 'fourth milestone', NULL, NULL, NULL);

-- Referral to FHA milestones
INSERT INTO public.ien_applicant_status_audit
    (start_date, created_date, updated_date, status_id, applicant_id, added_by_id, updated_by_id, job_id, notes, reason_other, effective_date, reason_id)
VALUES
    ('2020-04-01', '2022-06-22 00:03:06.663323', '2022-06-22 00:03:06.663323', '9e97a1b3-a48e-3fb0-082c-3a0601aa2678', '8385c912-40aa-46d8-9cfb-fc9785db9804', (SELECT id from ien_users where name = 'ien_e2e'), NULL, NULL, 'Applicant Referred to NHA', NULL, NULL, NULL),
    ('2020-04-01', '2022-06-22 00:03:06.663323', '2022-06-22 00:03:06.663323', '001dfb24-1618-e975-6578-3a0601aac804', '8385c912-40aa-46d8-9cfb-fc9785db9804', (SELECT id from ien_users where name = 'ien_e2e'), NULL, NULL, 'Applicant Referred to VIHA', NULL, NULL, NULL),
    ('2020-04-01', '2022-06-22 00:03:06.663323', '2022-06-22 00:03:06.663323', '001dfb24-1618-e975-6578-3a0601aac804', 'c23ea09d-bbc5-4dd2-8ce2-9b21f3d571af', (SELECT id from ien_users where name = 'ien_e2e'), NULL, NULL, 'Applicant Referred to VIHA', NULL, NULL, NULL),
    ('2020-04-01', '2022-06-22 00:03:06.663323', '2022-06-22 00:03:06.663323', 'dfcfa87a-40f9-ec41-2afa-3a0601a9ce32', 'c23ea09d-bbc5-4dd2-8ce2-9b21f3d571af', (SELECT id from ien_users where name = 'ien_e2e'), NULL, NULL, 'Applicant Referred to FHA', NULL, NULL, NULL);;
