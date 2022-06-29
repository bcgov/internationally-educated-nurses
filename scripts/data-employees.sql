INSERT INTO employee
    (id, created_date, updated_date, name, email, role, keycloak_id)
VALUES
    ('9047e1c2-ea17-474e-84a2-745b62bb8ed4', '2022-05-26 21:06:07.859325', '2022-05-26 21:06:07.859325', 'ien_e2e', 'ien@freshworks.io', 'roleadmin', '61b95719-b3ab-4bb4-949f-14de050b9587'),
    ('c3986bc5-81d7-4736-b298-9df2bb0779ae', '2022-06-20 23:18:48.463797', '2022-06-20 23:19:11.205061', 'ien_e2e_hmbc', 'ien-hmbc@freshworks.io', 'hmbc', '1f033ec7-6f82-4ea3-a680-83b74ca8576d'),
    ('efb33797-e40c-1dc9-8d99-13007d40dba1', '2022-05-30 19:46:26.841586', '2022-05-30 19:46:26.841586', 'test1', 'test1@mailinator.ca', 'moh', '1873a32a-29e2-4f69-8913-05c65819a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d40dab1', '2022-05-29 19:46:26.841586', '2022-05-29 19:46:26.841586', 'test2', 'test2@mailinator.ca', 'pending', '6663a33a-29e2-4f69-8913-05c65419a9b6'),
    ('aab33797-e40c-3dc9-8d90-13007d40bda1', '2022-05-28 19:46:26.841586', '2022-05-28 19:46:26.841586', 'test3', 'test3@mailinator.ca', 'hmbc', '9993a34a-29e2-4f69-8913-05c65419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d41dab1', '2022-05-27 19:46:26.841586', '2022-05-27 19:46:26.841586', 'ien-2', 'test4@mailinator.ca', 'moh', '6663a33a-29e2-4f69-8913-05c15419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d42dab1', '2022-05-26 19:46:26.841586', '2022-05-26 19:46:26.841586', 'test5', 'test5@mailinator.ca', 'pending', '6663a33a-29e2-4f69-8913-25c65419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d43dab1', '2022-05-25 19:46:26.841586', '2022-05-25 19:46:26.841586', 'test6', 'test6@mailinator.ca', 'hmbc', '6663a33a-29e2-4f69-8913-05c35419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d44dab1', '2022-05-24 19:46:26.841586', '2022-05-24 19:46:26.841586', 'test7', 'test7@mailinator.ca', 'moh', '6663a33a-29e2-4f69-8913-05c64419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d45dab1', '2022-05-23 19:46:26.841586', '2022-05-23 19:46:26.841586', 'test8', 'test8@mailinator.ca', 'pending', '6663a33a-29e2-4f69-8913-55c65419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d46dab1', '2022-05-22 19:46:26.841586', '2022-05-22 19:46:26.841586', 'yes ien', 'test9@mailinator.ca', 'hmbc', '6663a33a-29e2-4f69-8913-05c75419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d47dab1', '2022-05-21 19:46:26.841586', '2022-05-21 19:46:26.841586', 'test10', 'test10@mailinator.ca', 'moh', '6663a33a-29e2-4f69-8913-05c85419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d48dab1', '2022-05-20 19:46:26.841586', '2022-05-20 19:46:26.841586', 'test11', 'test11@mailinator.ca', 'pending', '6663a33a-29e2-4f69-8913-95c65419a9b6'),
    ('adb33797-e40c-2dc9-8d88-13007d10dab1', '2022-05-18 19:46:26.841586', '2022-05-18 19:46:26.841586', 'test13', 'test13@mailinator.ca', 'moh', '6663a33a-29e2-4f69-8913-05c12419a9b6'),
    ('adb33797-e40c-2dc9-8d88-19107d10dab1', '2022-05-17 19:46:26.841586', '2022-05-17 19:46:26.841586', 'test14', 'test14@mailinator.ca', 'pending', '8883a33a-29e2-4f69-8913-05c12419a9b6')
;
UPDATE ien_users SET email = (SELECT email FROM employee WHERE name = 'ien_e2e') WHERE user_id = '1';
UPDATE ien_users SET email = (SELECT email FROM employee WHERE name = 'ien_e2e_hmbc') WHERE user_id = '2';
