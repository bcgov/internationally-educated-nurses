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

INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('9066B792-6FBF-4E60-803F-0554E4B4DBA9','Completed Simulation Lab Assessment (SLA)',NULL,'IEN Licensing/Registration Process','Completed Simulation Lab Assessment (SLA)') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('8A9B0D13-F5D7-4BE3-8D38-11E5459F9E9A','Applied to BCCNM',NULL,'IEN Licensing/Registration Process','Applied to BCCNM') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('4D435C42-F588-4174-BB1E-1FE086B23214','Sent First Steps document to candidate',NULL,'BC PNP Process','Sent First Steps document to candidate') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('20268C6E-145E-48CD-889A-2346985DB957','Received NNAS Report',NULL,'IEN Licensing/Registration Process','Received NNAS Report') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('E68F902C-8440-4A9C-A05F-2765301DE800','Applied to NNAS',NULL,'IEN Licensing/Registration Process','Applied to NNAS') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('E768029B-4BA1-4147-94F8-29587C6BB650','Received Work Permit (Arrival in Canada)',NULL,'BC PNP Process','Received Work Permit (Arrival in Canada)') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('61150E8A-6E83-444A-9DAB-3129A8CC0719','Completed Computer-Based Assessment (CBA)',NULL,'IEN Licensing/Registration Process','Completed Computer-Based Assessment (CBA)') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('74173FDE-B057-42DA-B2BA-327BDE532D2D','Received Permanent Residency',NULL,'BC PNP Process','Received Permanent Residency') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('91F55FAA-C71D-83C8-4F10-3A05E778AFBC','BCCNM Provisional Licence LPN',NULL,'IEN Licensing/Registration Process','BCCNM Provisional Licence LPN') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('D2656957-EC58-15C9-1E21-3A05E778DC8E','BCCNM Provisional Licence RN',NULL,'IEN Licensing/Registration Process','BCCNM Provisional Licence RN') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('D9AD22CD-7629-67EA-5734-3A05E77A47F6','REx-PN - Written',NULL,'IEN Licensing/Registration Process','REx-PN - Written') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('36B0CACF-ACD1-6BC5-3E4C-3A05E77A79C9','REx-PN - Passed',NULL,'IEN Licensing/Registration Process','REx-PN - Passed') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('632374E6-CA2F-0BAA-F994-3A05E77C118A','BCCNM Full Licence LPN',NULL,'IEN Licensing/Registration Process','BCCNM Full Licence LPN') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('CA858996-D1AD-2FE3-D8D3-3A05E77C9A2A','Registered as an HCA',NULL,'IEN Licensing/Registration Process','Registered as an HCA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('5B4173E1-E750-9B85-9464-3A05E77D4547','Registration Journey Complete',NULL,'IEN Licensing/Registration Process','Registration Journey Complete') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('73A4B092-AE7E-DE91-17E1-3A05E7864830','Applicant Referred to FNHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to FNHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('DFCFA87A-40F9-EC41-2AFA-3A0601A9CE32','Applicant Referred to FHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to FHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('B5452D40-7DFD-D614-0319-3A0601AA0749','Applicant Referred to IHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to IHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('9E97A1B3-A48E-3FB0-082C-3A0601AA2678','Applicant Referred to NHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to NHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('E5F02166-36CB-12A8-A5BA-3A0601AA5AED','Applicant Referred to PHC',NULL,'IEN Licensing/Registration Process','Applicant Referred to PHC') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('42054107-17FB-E6E7-EB58-3A0601AA8DD3','Applicant Referred to PHSA',NULL,'IEN Licensing/Registration Process','Applicant Referred to PHSA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('26069C6C-A5B8-A2AC-C94D-3A0601AAB009','Applicant Referred to VCHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to VCHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('001DFB24-1618-E975-6578-3A0601AAC804','Applicant Referred to VIHA',NULL,'IEN Licensing/Registration Process','Applicant Referred to VIHA') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('DB964868-9EEB-E34D-9992-3A0601B2382C','Candidate Passed Pre-Screen',NULL,'IEN Recruitment Process','Candidate Passed Pre-Screen') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('66D4EC85-6A28-87FD-0AAA-3A0601B26EDD','Candidate Did Not Pass Pre-Screen',NULL,'IEN Recruitment Process','Candidate Did Not Pass Pre-Screen') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('BD91E596-8F9A-0C98-8B9C-3A0601B2A18B','Candidate Passed Interview',NULL,'IEN Recruitment Process','Candidate Passed Interview') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('91C06396-A8F3-4D10-5A09-3A0601B2C98E','Candidate Did Not Pass Interview',NULL,'IEN Recruitment Process','Candidate Did Not Pass Interview') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('D875B680-F027-46B7-05A5-3A0601B3A0E1','Candidate Passed Reference Check',NULL,'IEN Recruitment Process','Candidate Passed Reference Check') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('4F5E371E-F05E-A374-443F-3A0601B3EEDE','Candidate Did Not Pass Reference Check',NULL,'IEN Recruitment Process','Candidate Did Not Pass Reference Check') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('70B1F5F1-1A0D-EF71-42EA-3A0601B46BC2','Job Offer Accepted',NULL,'IEN Recruitment Process','Job Offer Accepted') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('FC048E66-0173-FA1A-D0D2-3A0601B4EA3A','Job Offer Not Accepted',NULL,'IEN Recruitment Process','Job Offer Not Accepted') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('22EA1AA6-78B7-ECB6-88A7-3A0601B53B20','Job Competition Cancelled',NULL,'IEN Recruitment Process','Job Competition Cancelled') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('9B40266E-93C8-D827-B7CB-3A0601B593E0','HA is Not Interested',NULL,'IEN Recruitment Process','HA is Not Interested') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('B8BA04A8-148E-AB32-7EB9-3A0601B5B5AF','No Position Available',NULL,'IEN Recruitment Process','No Position Available') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('F3369599-1749-428B-A35D-562F92782E1C','Submitted application to BC PNP',NULL,'BC PNP Process','Submitted application to BC PNP') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('B93E7BF6-5F2B-43FD-B4B7-58C42AA02BFA','Applicant Ready for Job Search',NULL,'IEN Licensing/Registration Process','Applicant Ready for Job Search') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('EAD2E076-DF00-4DAB-A0CC-5A7F0BAFC51A','Referred to NCAS',NULL,'IEN Licensing/Registration Process','Referred to NCAS') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('F004F837-3357-416B-918E-651BD6FAECB5','Referral Acknowledged/Reviewed',NULL,'IEN Recruitment Process','Referral Acknowledged/Reviewed') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('06E2D762-05BA-4667-93D2-7843D3CF9FC5','Completed NCAS',NULL,'IEN Licensing/Registration Process','Completed NCAS') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('DA06889E-55A1-4FF2-9984-80AE23D7E44B','Completed English Language Requirement',NULL,'IEN Licensing/Registration Process','Completed English Language Requirement') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('DA813B28-F617-4B5C-8E05-84F0AE3C9429','Sent Second Steps document to candidate',NULL,'BC PNP Process','Sent Second Steps document to candidate') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('18AA32C3-A6A4-4431-8283-89931C141FDE','BCCNM Full Licence RN',NULL,'IEN Licensing/Registration Process','BCCNM Full Licence RN') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('4189CA04-C1E1-4C22-9D6B-8AFD80130313','Referred to Registration Exam',NULL,'IEN Licensing/Registration Process','Referred to Registration Exam') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('B0D38AA5-B776-4033-97F7-9894E9B33A3C','NCLEX – Passed',NULL,'IEN Licensing/Registration Process','NCLEX – Passed') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('CAA18ECD-FEA5-459E-AF27-BCA15AC26133','Received Work Permit Approval Letter',NULL,'BC PNP Process','Received Work Permit Approval Letter') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('8024ED3A-803F-4E34-9934-C29565DAAF63','Referred to Additional Education',NULL,'IEN Licensing/Registration Process','Referred to Additional Education') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('0D6BCFE1-FB00-45CB-A9C6-C6A53DA12E62','NCLEX – Written',NULL,'IEN Licensing/Registration Process','NCLEX – Written') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('59263418-77EA-411F-894D-C84B5E1F710F','Completed Additional Education',NULL,'IEN Licensing/Registration Process','Completed Additional Education') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('3EF75425-42EB-4CC2-8A27-C9726F6F55FA','Received Confirmation of Nomination',NULL,'BC PNP Process','Received Confirmation of Nomination') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('897156C7-958C-4EC0-879A-ED4943AF7B72','Submitted Documents (NNAS Application in Review)',NULL,'IEN Licensing/Registration Process','Submitted Documents (NNAS Application in Review)') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('F84A4167-A636-4B21-977C-F11AEFC486AF','Withdrew from IEN program',NULL,'IEN Licensing/Registration Process','Withdrew from IEN program') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('F2008E2F-5F44-4F4C-80B4-F4AD284E9938','Submitted Work Permit Application',NULL,'BC PNP Process','Submitted Work Permit Application') ON CONFLICT(id) DO NOTHING;
INSERT INTO public.ien_applicant_status (id, status, parent_id, category, full_name) VALUES ('1651CAD1-1E56-4C79-92CE-F548AD9EC52C','Sent employer documents to HMBC',NULL,'BC PNP Process','Sent employer documents to HMBC') ON CONFLICT(id) DO NOTHING;