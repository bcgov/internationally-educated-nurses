INSERT INTO public.ien_applicant_jobs
    (id, job_id, recruiter_name, job_post_date, created_date, updated_date, ha_pcn_id, job_title_id, added_by_id, applicant_id)
VALUES
    (11, '1234567891', 'Recruit1', '2018-01-01', '2022-06-21 20:46:01.693183', '2022-06-21 20:46:01.693183', 1, 2, NULL,'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (12, '1234567892', 'Recruit2', '2019-02-02', '2022-06-21 20:46:14.219', '2022-06-21 20:46:14.219', 2, 2, NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (13, '1234567893', 'Recruit3', '2019-03-02', '2022-06-21 20:46:27.07944', '2022-06-21 20:46:27.07944', 3, 3, NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (14, '1234567894', 'Recruit4', '2019-04-02', '2022-06-21 20:46:40.743922', '2022-06-21 20:46:40.743922', 4, 4, NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (15, '1234567895', 'Recruit5', '2019-05-02', '2022-06-21 20:46:52.814603', '2022-06-21 20:46:52.814603', 5, 5, NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (16, '1234567896', 'Recruit6', '2019-06-02', '2022-06-21 20:47:05.093503', '2022-06-21 20:47:05.093503', 1, 6, NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368')
;

INSERT INTO public.ien_applicant_jobs_job_location_ien_job_locations
    (ien_applicant_jobs_id, ien_job_locations_id)
VALUES
    (11, 1),
    (12, 2),
    (13, 3),
    (14, 4),
    (15, 5),
    (16, 6)
;
