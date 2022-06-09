COPY public.ien_status_reasons (id, name, i_e_n_program, recruitment) FROM stdin;
1	Accepted another job in BC	t	t
2	Accepted another job outside of BC	t	t
3	Accepted another nursing job (private) in BC	t	t
4	Accepted another nursing job (public or private) outside of BC	t	t
5	Cannot meet the program criteria	t	f
6	Cost of the IEN process	t	f
7	Personal reasons	t	t
8	Pursuing licensure in another province	t	f
9	Timing	t	f
10	Unresponsive	t	t
11	Accepted another nursing job (public) in BC	f	t
12	Community - Cost of living	f	t
13	Community - Limited accommodation/housing available	f	t
14	Compensation (pay/benefits)	f	t
15	Immigration concerns/issues	f	t
16	Job search on hold	f	t
17	Job suitability	f	t
19	Revoked job search	f	t
20	Withdrew from IEN program	f	t
21	Other	f	t
\.

INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10001,'IEN HMBC Process',NULL,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10002,'IEN Licensing/Registration',NULL,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10003,'IEN Recruitment (once licensed)',NULL,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10004,'BC PNP (once job offer obtained and if immigration required)',NULL,'NULL','NULL') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10005,'Final Milestone',NULL,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (301,'Prescreen completed',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (302,'Interview completed',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (303,'References completed',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (304,'Offered position',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (305,'Candidate withdrew',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (306,'Candidate was unresponsive',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (307,'Candidate was not selected ',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (308,'Candidate accepted the job offer',10003,NULL,NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (201,'Applied to NNAS',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (202,'Documents Submitted (NNAS Application in Review)',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (203,'Received NNAS Report',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (204,'Applied to BCCNM',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (205,'Completed English Language Requirement*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (206,'Referred to NCAS*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (207,'Completed Computer-Based Assessment (CBA)*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (208,'Completed Oral Assessment (OA) and Simulation Lab Assessment (SLA)*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (209,'Completed NCAS*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (210,'Referred to Additional Education*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (211,'Completed Additional Education*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (212,'Referred to NCLEX*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (213,'Eligible for Provisional Licensure*',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (214,'NCLEX - Written',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (215,'NCLEX - Passed ',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (216,'BCCNM Licensed - Full License',10002,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (401,'First Steps Document Sent',10004,'HMBC',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (402,'Documents sent to HMBC',10004,'HA',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (403,'Application Submitted to BC PNP',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (404,'Confirmation of Nomination Received',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (405,'Second Steps Sent',10004,'HMBC',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (406,'Work Permit Application Submitted *',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (407,'Work Permit Approval Letter Received *',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (408,'Arrival in Canada - Work Permit Received',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (409,'Permanent Residency',10004,'Candidate',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (501,'Candidate started job',10005,'HA',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (100,'Fully Licensed',10001,'Applicant','Applicant - Fully Licensed') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (101,'Referral Acknowledged',10001,'HMBC','HMBC - Referral Acknowledged') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (102,'Referral Follow-up With Candidate',10001,'HMBC','HMBC - Referral Follow-up With Candidate') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (103,'Referral Follow-up with Employer',10001,'HMBC','HMBC - Referral Follow-up with Employer') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (104,'Referred to Employer',10001,'HMBC','HMBC - Referred to Employer') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (105,'Eligible for License in BC',10001,'Applicant','Applicant - Eligible for License in BC') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (106,'Post SEC Education Required',10001,'CRNBC','CRNBC - Post SEC Education Required') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (107,'Referred to College',10001,'HMBC','HMBC - Referred to College') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (109,'Waiting for SEC Assessment',10001,'Applicant','Applicant - Waiting for SEC Assessment') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (110,'CV Requested - 1st Time',10001,'HMBC','HMBC - CV Requested - 1st Time') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (111,'Working on English Proficiency',10001,'Applicant','Applicant - Working on English Proficiency') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (112,'Vacancy Matched to Other Candidate',10001,'HMBC','HMBC - Vacancy Matched to Other Candidate') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (113,'Waiting for SEC Results',10001,'Applicant','Applicant - Waiting for SEC Results') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (120,'CV Received',10001,'Applicant','Applicant - CV Received') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (125,'Introduction/Follow-up with Employer',10001,'HMBC','HMBC - Introduction/Follow-up with Employer') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (160,'Initial Response',10001,'HMBC','HMBC - Initial Response') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (170,'Consultant Response',10001,'HMBC','HMBC - Consultant Response') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (195,'Revoked Job Search',10001,'Applicant','Applicant - Revoked Job Search') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (320,'Applicant – Applied to College',10001,'Applicant','Applicant - Applicant – Applied to College') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (321,'Royal College Pending',10001,'Applicant','Applicant - Royal College Pending') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (322,'Hold',10001,'CPSBC','CPSBC - Hold') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (324,'Ineligible',10001,'CPSBC','CPSBC - Ineligible') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (326,'Pre-Approved',10001,'CPSBC','CPSBC - Pre-Approved') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (328,'Approved',10001,'CPSBC','CPSBC - Approved') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (455,'Ineligible',10001,'CRNBC','CRNBC - Ineligible') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (458,'Approved',10001,'CRNBC','CRNBC - Approved') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (520,'Refuse',10001,'HMBC','HMBC - Refuse') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (550,'Referred to Site',10001,'HMBC','HMBC - Referred to Site') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (600,'Site Offer',10001,'Employer','Employer - Site Offer') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (610,'Site Refuse',10001,'Employer','Employer - Site Refuse') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (615,'Site Offer Rescinded',10001,'Employer','Employer - Site Offer Rescinded') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (630,'Not Interested in Vacancy',10001,'Applicant','Applicant - Not Interested in Vacancy') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (632,'Site No Response',10001,'Employer','Employer - Site No Response') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (655,'Duplicate Application',10001,'HMBC','HMBC - Duplicate Application') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (700,'Accepted/Matched',10001,'Applicant','Applicant - Accepted/Matched') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (710,'Declined Offer',10001,'Applicant','Applicant - Declined Offer') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (860,'Transfer Within BC',10001,'Applicant','Applicant - Transfer Within BC') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (910,'Hold',10001,'Applicant','Applicant - Hold') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (990,'Reapplication',10001,'Applicant','Applicant - Reapplication') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (991,'Approved',10001,'CRPNBC','CRPNBC - Approved') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (992,'Ineligible',10001,'CRPNBC','CRPNBC - Ineligible') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (993,'SEC Candidate',10001,'Applicant','Applicant - SEC Candidate') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (994,'Supporting Documents Outstanding 1',10001,'Applicant','Applicant - Supporting Documents Outstanding 1') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (995,'Supporting Documents Outstanding 2',10001,'Applicant','Applicant - Supporting Documents Outstanding 2') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (996,'Consultant Follow-up',10001,'HMBC','HMBC - Consultant Follow-up') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (997,'Candidate Applied Directly',10001,'CPSBC','CPSBC - Candidate Applied Directly') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (998,'CV Requested - 2nd Time',10001,'HMBC','HMBC - CV Requested - 2nd Time') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (999,'Denied Visa',10001,'CIC','CIC - Denied Visa') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1000,'Paper File Purged',10001,'HMBC','HMBC - Paper File Purged') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1001,'CPSBC Registration w/Subjects',10001,'CPSBC','CPSBC - CPSBC Registration w/Subjects') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1002,'CPSBC Registration – Subjects Removed',10001,'CPSBC Registration','CPSBC Registration - CPSBC Registration – Subjects Removed') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1003,'Hold - No Vacancy Currently Available',10001,'HMBC','HMBC - Hold - No Vacancy Currently Available') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1004,'Duplicate Application',10001,'Employer','Employer - Duplicate Application') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1005,'Referral Acknowledged',10001,'Employer','Employer - Referral Acknowledged') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1006,'Applied to CPSBC',10001,'Applicant','Applicant - Applied to CPSBC') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1007,'J1 Visa Applicant',10001,'Applicant','Applicant - J1 Visa Applicant') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1008,'PNP',10001,'Applicant','Applicant - PNP') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1009,'Applied for PNP',10001,'Applicant','Applicant - Applied for PNP') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1010,'Referred to NNAS',10001,'HMBC','HMBC - Referred to NNAS') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1011,'Approved',10001,'BCCNM','BCCNM - Approved') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1012,'Eligible',10001,'BCCNM','BCCNM - Eligible') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1013,'Ineligible',10001,'BCCNM','BCCNM - Ineligible') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1014,'Provisional',10001,'BCCNM','BCCNM - Provisional') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1015,'Former',10001,'BCCNM','BCCNM - Former') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1016,'Submitted AMRC',10001,'Applicant','Applicant - Submitted AMRC') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1017,'Account Deleted',10001,'Applicant','Applicant - Account Deleted') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1018,'Transition to Recruitment Team',10001,'HMBC','HMBC - Transition to Recruitment Team') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1019,'Transition to Immigration Team',10001,'HMBC','HMBC - Transition to Immigration Team') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1020,'Ready for Job Search',10001,'Applicant','Applicant - Ready for Job Search') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1021,'MOH/IMG',10001,'Applicant','Applicant - MOH/IMG') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1022,'MOH/IEN',10001,'Applicant','Applicant - MOH/IEN') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1023,'New Grad',10001,'Applicant','Applicant - New Grad') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (1,'Candidate expresses interest / or applies directly to a posting',10001,NULL, NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (2,'Candidate registered for navigation services',10001,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (3,'Completed candidate profile',10001,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (4,'Applied to NNAS',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (5,'Submitted documents (NNAS Application in Review)',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (6,'Received NNAS Report',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (7,'Applied to BCCNM',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (8,'Completed English Language Requirement',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (9,'Referred to NCAS',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (10,'Completed Computer-Based Assessment (CBA)',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (11,'Completed Oral Assessment (OA) and Simulation Lab Assessment (SLA)',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (12,'Completed NCAS',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (13,'Referred to Additional Education',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (14,'Completed Additional Education',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (15,'Referred to NCLEX',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (16,'Eligible for Provisional Licensure',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (17,'NCLEX – Written',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (18,'NCLEX – Passed',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (19,'BCCNM Licensed – Full License',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (20,'Withdrew from IEN program',10002,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (30,'Sent First Steps document to candidate',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (31,'Sent employer documents to HMBC',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (32,'Submitted application to BC PNP',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (33,'Received Confirmation of Nomination',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (34,'Sent Second Steps document to candidate',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (35,'Submitted Work Permit Application',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (36,'Received Work Permit Approval Letter',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (37,'Received Work Permit (Arrival in Canada)',10004,'',NULL) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, party, full_name) VALUES (38,'Received Permanent Residency',10004,'',NULL) ON CONFLICT(id) DO NOTHING;

