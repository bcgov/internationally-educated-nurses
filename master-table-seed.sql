INSERT INTO public.ien_applicant_status(status) VALUES ('IEN HMBC Process');
INSERT INTO public.ien_applicant_status(status) VALUES ('IEN Licensing/Registration');
INSERT INTO public.ien_applicant_status(status) VALUES ('IEN Recruitment (once licensed)');
INSERT INTO public.ien_applicant_status(status) VALUES ('BC PNP (once job offer obtained and if immigration required)');
INSERT INTO public.ien_applicant_status(status) VALUES ('Final Milestone');

-- IEN HMBC Process
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HMBC - Registered for HMBC services', (SELECT id FROM public.ien_applicant_status WHERE status='IEN HMBC Process'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HMBC - Profile Complete', (SELECT id FROM public.ien_applicant_status WHERE status='IEN HMBC Process'));

-- IEN Licensing/Registration
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Applied to NNAS', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Documents Submitted (NNAS Application in Review)', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Received NNAS Report', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Applied to BCCNM', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Completed English Language Requirement*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Referred to NCAS*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Completed Computer-Based Assessment (CBA)*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Completed Oral Assessment (OA) and Simulation Lab Assessment (SLA)*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Completed NCAS*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Referred to Additional Education*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Completed Additional Education*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Referred to NCLEX*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Eligible for Provisional Licensure*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - NCLEX - Written', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - NCLEX - Passed ', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - BCCNM Licensed - Full License', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Licensing/Registration'));

-- IEN Recruitment (once licensed)
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HMBC - Applicant ready for job search', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Acknowledgement/Referral Reviewed', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Pre-Screen Process', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Not Interested', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - No Position Available', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Candidate Withdrawn', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - CV Forwarded (to Hiring Manager)', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Interview', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Reference Check', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Job Offer sent', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Job offer accepted', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Hired', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Referred to BC PNP (if immigration required, see below)*', (SELECT id FROM public.ien_applicant_status WHERE status='IEN Recruitment (once licensed)'));

-- BC PNP (once job offer obtained and if immigration required)
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HMBC - First Steps Document Sent', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Documents sent to HMBC', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Application Submitted to BC PNP', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Confirmation of Nomination Received', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HMBC - Second Steps Sent', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Work Permit Application Submitted *', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Work Permit Approval Letter Received *', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Arrival in Canada - Work Permit Received', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('Candidate - Permanent Residency', (SELECT id FROM public.ien_applicant_status WHERE status='BC PNP (once job offer obtained and if immigration required)'));

-- Final Milestone
INSERT INTO public.ien_applicant_status(status, parent_id) VALUES ('HA - Candidate started job', (SELECT id FROM public.ien_applicant_status WHERE status='Final Milestone'));



-- HA/PCN Comm

INSERT INTO public.ien_ha_pcn(title) VALUES ('FHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('FNHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('IHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('NHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('PHC');
INSERT INTO public.ien_ha_pcn(title) VALUES ('PHSA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('VCHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('VIHA');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Fraser Northwest');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Vancouver');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Richmond');
INSERT INTO public.ien_ha_pcn(title) VALUES ('South Okanagan Similkameen');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Burnaby');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Saanich Peninsula');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Western Communities');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Kootenay Boundary');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Ridge Meadows');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Central Okanagan');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Chilliwack');
INSERT INTO public.ien_ha_pcn(title) VALUES ('East Kootenay');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Oceanside');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Comox');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Cowichan Valley');
INSERT INTO public.ien_ha_pcn(title) VALUES ('North Shore');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Nanaimo');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Central Interior Rural');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Mission');
INSERT INTO public.ien_ha_pcn(title) VALUES ('North Peace');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Northern Interior Rural');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Pacific Northwest');
INSERT INTO public.ien_ha_pcn(title) VALUES ('White Rock/South Surrey');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Prince George');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Campbell River');
INSERT INTO public.ien_ha_pcn(title) VALUES ('Sea to Sky (Squamish)');
INSERT INTO public.ien_ha_pcn(title) VALUES ('North Okanagan');
INSERT INTO public.ien_ha_pcn(title) VALUES ('GovBC');


-- Assigned To

INSERT INTO public.ien_users(name) VALUES ('Chadi');
INSERT INTO public.ien_users(name) VALUES ('Nicole');


-- Education list

INSERT INTO public.ien_education(title) VALUES ('Diploma/Certificate of Nursing');
INSERT INTO public.ien_education(title) VALUES ('Associate Degree of Nursing');
INSERT INTO public.ien_education(title) VALUES ('Bachelor of Nursing or Bachelor of Science in Nursing');
INSERT INTO public.ien_education(title) VALUES ('Master of Nursing');
INSERT INTO public.ien_education(title) VALUES ('Master of Nursing - Nurse Practitioner');
INSERT INTO public.ien_education(title) VALUES ('PhD');
INSERT INTO public.ien_education(title) VALUES ('Combined Diploma/Degree in Midwifery & Nursing');



-- Job titles

INSERT INTO public.ien_job_titles(title) VALUES ('Nursing practitioner');


-- Job Locations

INSERT INTO public.ien_job_locations(title) VALUES ('Surrey Memorial Hospital');



-- applicant job

-- INSERT INTO public.ien_applicant_jobs(
--	job_id, recruiter_name, job_post_date, ha_pcn_id, job_title_id, job_location_id, added_by_id, applicant_id)
--	VALUES ('ABC1234', 'Chadi', '2021-12-15', 1, 1, 1, 1, 'e5b74e64-be37-4191-b45d-a5ac87a101bc');