INSERT INTO employee
    (id, created_date, updated_date, name, email, keycloak_id)
VALUES
    ('9047e1c2-ea17-474e-84a2-745b62bb8ed4', '2022-05-26 21:06:07.859325', '2022-05-26 21:06:07.859325', 'ien_e2e', 'ien@freshworks.io', '61b95719-b3ab-4bb4-949f-14de050b9587'),
    ('b2355756-625f-4aff-aa67-a2bb3edbd1bd', '2022-05-27 19:46:26.841586', '2022-05-27 19:46:26.841586', 'ien_ha', 'ien_ha@islandhealth.ca', '76e22994-7db0-4722-b612-ee63b8c6f051'),
    ('a09d7e3b-333a-4469-a80e-9127cf400b16', '2022-05-26 19:46:26.841586', '2022-05-26 19:46:26.841586', 'ien_e2e_view', 'ien_e2e_view@fraserhealth.ca', '873d91ca-e05b-446e-b9fe-e22c0ed1ba18'),
    ('cc65c5cc-b986-459f-93aa-df896520709e', '2022-05-25 19:46:26.841586', '2022-05-25 19:46:26.841586', 'ien_moh', 'ien_moh@gov.bc.ca',  '8ce0e43e-1918-43d2-9874-cafb5a10c959'),
    ('7e7397f1-3311-49a3-9289-1c52480ffd92', '2022-05-24 19:46:26.841586', '2022-05-24 19:46:26.841586', 'ien_hmbc', 'ien_hmbc@healthmatchbc.org', '805e7530-4a0d-4f11-9eb1-a13066e45a5e'),
    ('4a3b94ee-e079-4bf6-9676-03096ed6e2bc', '2022-05-23 19:46:26.841586', '2022-05-23 19:46:26.841586', 'ien_fnha', 'ien_fnha@fnha.ca', '7671e670-46cd-4ac6-a3eb-e414b48dc695'),
    ('7923e375-ac32-4249-8f5c-00f558321e91', '2022-05-22 19:46:26.841586', '2022-05-22 19:46:26.841586', 'ien_fha', 'ien_fha@fraserhealth.ca',  'c16c29e8-1d2a-4e47-9f3a-fe86417e363e'),
    ('e990964f-5ea8-4fab-a3bb-97fed04971ca', '2022-05-22 19:46:26.841586', '2022-05-22 19:46:26.841586', 'ien_fha2', 'ien_fha2@fraserhealth.ca',  '800bfe76-6af2-4900-86c9-6f33c7f211fe'),
    ('395351ac-0bf5-46ad-91e7-3354dea4fd2c', '2022-05-21 19:46:26.841586', '2022-05-21 19:46:26.841586', 'ien_iha', 'ien_iha@interiorhealth.ca', 'a43250b9-ed2a-46d3-8410-62832d2a9778'),
    ('3b7add02-ff24-4736-94db-8157faf74f95', '2022-05-20 19:46:26.841586', '2022-05-20 19:46:26.841586', 'ien_viha', 'ien_viha@islandhealth.ca', '33d61878-462b-463c-bda7-1f9835bbfa19'),
    ('d6cd8304-a1c3-43d8-9031-69bf86c16bf2', '2022-05-18 19:46:26.841586', '2022-05-18 19:46:26.841586', 'ien_nha', 'ien_nha@northernhealth.ca', '91bff55a-d2b1-4d0b-a626-1f3d011b27ab'),
    ('94e4083f-4811-46f8-8713-5d49c4070d36', '2022-05-18 19:46:26.841586', '2022-05-18 19:46:26.841586', 'ien_phsa', 'ien_phsa@phsa.ca', 'b413f7f0-4649-4698-bffd-133aa8c5043b'),
    ('2e078e7e-e3a2-4e2c-b786-25d3fda6e96f', '2022-05-17 19:46:26.841586', '2022-05-17 19:46:26.841586', 'ien_phc', 'ien_phc@providencehealth.bc.ca', '62f46a86-47a7-4d78-b480-9fa8a482f99a'),
    ('0b828eb4-ce3c-43c0-8109-44ada2a1ab5d', '2022-05-30 19:46:26.841586', '2022-05-30 19:46:26.841586', 'test1', 'test1@mailinator.ca', '95277436-0e1c-4188-bf2b-3510da161615'),
    ('bef6f2f2-1665-4e6c-8504-e8bb3d81c36e', '2022-05-29 19:46:26.841586', '2022-05-29 19:46:26.841586', 'test2', 'test2@mailinator.ca', 'a2ada57a-2d5d-42af-96e6-cf6aa4f74c2f'),
    ('f05ace96-eb7b-4776-a431-77203bce55e8', '2022-05-28 19:46:26.841586', '2022-05-28 19:46:26.841586', 'test3', 'test3@mailinator.ca',  'aefb0b79-66d2-485f-a5bc-e97dc284abc7');

INSERT INTO ien_users
    (name, created_date, email, id)
VALUES
    ('ien_e2e', '2022-07-25 20:54:58.045', 'ien@freshworks.io', 'b1529f60-5429-4f89-bbf7-a0d48481bacf'),
    ('ien_ha', '2022-07-25 20:54:58.045', 'ien_ha@islandhealth.ca', '271d4951-5f7a-4b78-84a3-a73a30e30155'),
    ('ien_e2e_view', '2022-07-25 20:54:58.045', 'ien_e2e_view@phsa.ca', 'fcba0a95-37ec-4e29-ac9b-0ea082a8e4a7'),
    ('ien_moh', '2022-07-25 20:54:58.045', 'ien_moh@gov.bc.ca', '6f73a3f5-6702-4be5-8002-12b0a9cdd5a3'),
    ('ien_hmbc', '2022-07-25 20:55:15.046', 'ien_hmbc@healthmatchbc.org', '794d1efb-8948-4d81-a811-1ada357fb3cc'),
    ('ien_fnha', '2022-07-25 20:55:29.316', 'ien_fnha@fnha.ca', 'f469c633-130d-4c7c-9dc6-eb12af62910c'),
    ('ien_fha', '2022-07-25 20:55:41.646', 'ien_fha@fraserhealth.org', '08270482-0080-456b-85df-57668b0939f1'),
    ('ien_fha2', '2022-07-25 20:55:41.646', 'ien_fha2@fraserhealth.org', 'e7355885-7d52-48de-9a2e-fc89a0fa270d'),
    ('ien_iha', '2022-07-25 20:55:55.491', 'ien_iha@interiorhealth.ca', '9255a537-e14e-4fa4-864b-f43253ceb909'),
    ('ien_viha', '2022-07-25 20:56:08.080', 'ien_viha@islandhealth.ca', 'f32bf751-6777-4312-b330-9ce46d695509'),
    ('ien_nha', '2022-07-25 20:56:21.819', 'ien_nha@northernhealth.ca', '68874e11-a7a0-4be5-947e-5190ab06e4c8'),
    ('ien_phsa', '2022-07-25 20:56:33.356', 'ien_phsa@phsa.ca', '07509836-ef86-4590-b5ef-056dc18e0a9e'),
    ('ien_phc', '2022-07-25 20:56:45.032', 'ien_phc@providencehealth.bc.ca', '51a1975f-5200-42bb-8929-1db3193c84bd');

INSERT INTO employee_roles_role
    (role_id, employee_id)
VALUES
    ((SELECT id FROM role WHERE slug = 'admin'), (SELECT id FROM employee WHERE name = 'ien_e2e')),
    ((SELECT id FROM role WHERE slug = 'applicant-read'), (SELECT id FROM employee WHERE name = 'ien_e2e')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_e2e')),
    ((SELECT id FROM role WHERE slug = 'provisioner'), (SELECT id FROM employee WHERE name = 'ien_e2e')),
    ((SELECT id FROM role WHERE slug = 'reporting'), (SELECT id FROM employee WHERE name = 'ien_e2e')),
    ((SELECT id FROM role WHERE slug = 'applicant-read'), (SELECT id FROM employee WHERE name = 'ien_e2e_view')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_hmbc')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_ha')),
    ((SELECT id FROM role WHERE slug = 'provisioner'), (SELECT id FROM employee WHERE name = 'ien_ha')),
    ((SELECT id FROM role WHERE slug = 'provisioner'), (SELECT id FROM employee WHERE name = 'test1')),
    ((SELECT id FROM role WHERE slug = 'reporting'), (SELECT id FROM employee WHERE name = 'test2')),
    ((SELECT id FROM role WHERE slug = 'data-extract'), (SELECT id FROM employee WHERE name = 'test3')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_fha')),
    ((SELECT id FROM role WHERE slug = 'applicant-read'), (SELECT id FROM employee WHERE name = 'ien_fha')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_fha2')),
    ((SELECT id FROM role WHERE slug = 'applicant-read'), (SELECT id FROM employee WHERE name = 'ien_fha2')),
    ((SELECT id FROM role WHERE slug = 'applicant-write'), (SELECT id FROM employee WHERE name = 'ien_viha')),
    ((SELECT id FROM role WHERE slug = 'applicant-read'), (SELECT id FROM employee WHERE name = 'ien_viha')),
    ((SELECT id FROM role WHERE slug = 'provisioner'), (SELECT id FROM employee WHERE name = 'ien_viha'))
;

UPDATE employee SET revoked_access_date = '2021-01-01' WHERE name = 'test1';
UPDATE employee SET revoked_access_date = '2021-01-01' WHERE name = 'test2';
