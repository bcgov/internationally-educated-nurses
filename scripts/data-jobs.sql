INSERT INTO public.ien_applicant_jobs
    (id, job_id, recruiter_name, job_post_date, created_date, updated_date, ha_pcn_id, job_title_id, added_by_id, applicant_id)
VALUES
    (11, '1234567891', 'Recruit1', '2018-01-01', '2022-06-21 20:46:01.693183', '2022-06-21 20:46:01.693183', '1ADC5904-17A8-B4CA-55C5-3A05E5B6797F', '3C214DC1-7EF7-48FF-904E-07E4B7C99154', NULL,'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (12, '1234567892', 'Recruit2', '2019-02-02', '2022-06-21 20:46:14.219', '2022-06-21 20:46:14.219', 'F314A4D7-86AD-0696-26F5-3A05E5B6FB7F', '0C08F63B-E4B7-4F97-94AD-14355C449D89', NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (13, '1234567893', 'Recruit3', '2019-03-02', '2022-06-21 20:46:27.07944', '2022-06-21 20:46:27.07944', '6AD69443-E3A8-3CBC-8CC9-3A05E5B771E4', '146B886D-1071-4235-A976-16872FD559D6', NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (14, '1234567894', 'Recruit4', '2019-04-02', '2022-06-21 20:46:40.743922', '2022-06-21 20:46:40.743922', '5C81ED72-6285-7F28-FAF0-3A05E5B8024F', '35886771-C411-4134-B36E-1C009356D656', NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (15, '1234567895', 'Recruit5', '2019-05-02', '2022-06-21 20:46:52.814603', '2022-06-21 20:46:52.814603', '28F4B8FD-588B-C170-3434-3A05E5B88823', '61EAC0C9-C8B5-44EB-8596-25FF6B5F27E4', NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368'),
    (16, '1234567896', 'Recruit6', '2019-06-02', '2022-06-21 20:47:05.093503', '2022-06-21 20:47:05.093503', '0388F125-E89F-2DF7-24A0-3A05E5C0956D', 'FE602B86-0F28-443F-8B8A-28CEB9487D34', NULL, 'f4c7da10-92c2-4f7f-a3a4-12dc2db1a368')
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
