# **Applicant/ Employee Tables**
## applicants

| Column                   | Type      | Size       | Nulls | Auto | Default              | Parents                   | Comments                  |
| ------------------------ | --------- | ---------- | ----- | ---- | -------------------- | ------------------------- | ------------------------- |
| id                       | uuid      | 2147483647 |       |      | uuid\_generate\_v4() |                           |                           |
| name                     | varchar   | 2147483647 |       |      | null                 |                           |                           |
| registration\_date       | date      | 13         | √     |      | null                 |                           |                           |
| additional\_data         | jsonb     | 2147483647 | √     |      | null                 |                           |                           |
| is\_open                 | bool      | 1          |       |      | true                 |                           |                           |
| created\_date            | timestamp | 296        |       |      | now()                |                           |                           |
| updated\_date            | timestamp | 296        |       |      | now()                |                           |                           |
| status\_id               | int4      | 10         | √     |      | null                 | ien\_applicant\_status.id |                           |
| added\_by\_id            | int4      | 10         | √     |      | null                 | ien\_users.id             |                           |
| updated\_by\_id          | int4      | 10         | √     |      | null                 | ien\_users.id             |                           |
| email\_address           | varchar   | 2147483647 | √     |      | null                 |                           |                           |
| phone\_number            | varchar   | 2147483647 | √     |      | null                 |                           |                           |
| assigned\_to             | jsonb     | 2147483647 | √     |      | null                 |                           |                           |
| country\_of\_residence   | varchar   | 2147483647 | √     |      | null                 |                           |                           |
| pr\_status               | varchar   | 2147483647 | √     |      | null                 |                           |                           |
| nursing\_educations      | jsonb     | 2147483647 | √     |      | null                 |                           |                           |
| bccnm\_license\_number   | varchar   | 2147483647 | √     |      | null                 |                           |                           |
| health\_authorities      | jsonb     | 2147483647 | √     |      | null                 |                           |                           |
| notes                    | jsonb     | 2147483647 | √     |      | null                 |                           |                           |
| applicant\_id            | int8      | 19         | √     |      | null                 |                           | HMBC ATS system unique ID |
| country\_of\_citizenship | jsonb     | 2147483647 | √     |      | null                 |                           |


## status_audit
| Column          | Type      | Size       | Nulls | Auto | Default              | Parents                   | Comments |
| --------------- | --------- | ---------- | ----- | ---- | -------------------- | ------------------------- | -------- |
| start\_date     | date      | 13         |       |      | null                 |                           |          |
| end\_date       | date      | 13         | √     |      | null                 |                           |          |
| created\_date   | timestamp | 296        |       |      | now()                |                           |          |
| updated\_date   | timestamp | 296        |       |      | now()                |                           |          |
| status\_id      | int4      | 10         | √     |      | null                 | ien\_applicant\_status.id |          |
| applicant\_id   | uuid      | 2147483647 | √     |      | null                 | ien\_applicants.id        |          |
| added\_by\_id   | int4      | 10         | √     |      | null                 | ien\_users.id             |          |
| updated\_by\_id | int4      | 10         | √     |      | null                 | ien\_users.id             |          |
| job\_id         | int4      | 10         | √     |      | null                 | ien\_applicant\_jobs.id   |          |
| notes           | varchar   | 2147483647 | √     |      | null                 |                           |          |
| reason\_other   | varchar   | 2147483647 | √     |      | null                 |                           |          |
| effective\_date | date      | 13         | √     |      | null                 |                           |          |
| reason\_id      | int4      | 10         | √     |      | null                 | ien\_status\_reasons.id   |          |
| id              | uuid      | 2147483647 |       |      | uuid\_generate\_v4() |                           |

## audit
| Column        | Type      | Size       | Nulls | Auto | Default                                             | Parents            | Comments |
| ------------- | --------- | ---------- | ----- | ---- | --------------------------------------------------- | ------------------ | -------- |
| id            | serial    | 10         |       | √    | nextval('ien\_applicant\_audit\_id\_seq'::regclass) |                    |          |
| data          | json      | 2147483647 | √     |      | null                                                |                    |          |
| created\_date | timestamp | 296        |       |      | now()                                               |                    |          |
| applicant\_id | uuid      | 2147483647 | √     |      | null                                                | ien\_applicants.id |          |
| added\_by\_id | int4      | 10         | √     |      | null                                                | ien\_users.id      |

## jobs
| Column          | Type      | Size       | Nulls | Auto | Default                                            | Parents             | Comments |
| --------------- | --------- | ---------- | ----- | ---- | -------------------------------------------------- | ------------------- | -------- |
| id              | serial    | 10         |       | √    | nextval('ien\_applicant\_jobs\_id\_seq'::regclass) |                     |          |
| job\_id         | varchar   | 2147483647 | √     |      | null                                               |                     |          |
| recruiter\_name | varchar   | 2147483647 | √     |      | null                                               |                     |          |
| job\_post\_date | date      | 13         | √     |      | null                                               |                     |          |
| created\_date   | timestamp | 296        |       |      | now()                                              |                     |          |
| updated\_date   | timestamp | 296        |       |      | now()                                              |                     |          |
| ha\_pcn\_id     | int4      | 10         | √     |      | null                                               | ien\_ha\_pcn.id     |          |
| job\_title\_id  | int4      | 10         | √     |      | null                                               | ien\_job\_titles.id |          |
| added\_by\_id   | int4      | 10         | √     |      | null                                               | ien\_users.id       |          |
| applicant\_id   | uuid      | 2147483647 | √     |      | null                                               | ien\_applicants.id  |

## jobs_job_location_ien_job_locations
| Column                   | Type | Size | Nulls | Auto | Default | Parents                 | Comments |
| ------------------------ | ---- | ---- | ----- | ---- | ------- | ----------------------- | -------- |
| ien\_applicant\_jobs\_id | int4 | 10   |       |      | null    | ien\_applicant\_jobs.id |          |
| ien\_job\_locations\_id  | int4 | 10   |       |      | null    | ien\_job\_locations.id  |

## assigned_to_ien_users
| Column              | Type | Size       | Nulls | Auto | Default | Parents            | Comments |
| ------------------- | ---- | ---------- | ----- | ---- | ------- | ------------------ | -------- |
| ien\_applicants\_id | uuid | 2147483647 |       |      | null    | ien\_applicants.id |          |
| ien\_users\_id      | int4 | 10         |       |      | null    | ien\_users.id      |

## ha_pcn_ien_ha_pcn
| Column              | Type | Size       | Nulls | Auto | Default | Parents            | Comments |
| ------------------- | ---- | ---------- | ----- | ---- | ------- | ------------------ | -------- |
| ien\_applicants\_id | uuid | 2147483647 |       |      | null    | ien\_applicants.id |          |
| ien\_ha\_pcn\_id    | int4 | 10         |       |      | null    | ien\_ha\_pcn.id    |

## employee
| Column        | Type      | Size | Nulls | Auto | Default              | Parents | Comments |
| ------------- | --------- | ---- | ----- | ---- | -------------------- | ------- | -------- |
| id            | varchar   | 36   |       |      | uuid\_generate\_v4() |         |          |
| created\_date | timestamp | 296  |       |      | CURRENT\_TIMESTAMP   |         |          |
| updated\_date | timestamp | 296  |       |      | CURRENT\_TIMESTAMP   |         |          |
| name          | varchar   | 128  |       |      | null                 |         |          |
| email         | varchar   | 128  | √     |      | null                 |         |          |
| role          | varchar   | 128  |       |      | null                 |         |          |
| keycloak\_id  | varchar   | 128  |       |      | null                 |         |

## ien_users
| Column        | Type      | Size       | Nulls | Auto | Default | Parents | Comments                                                                                    |
| ------------- | --------- | ---------- | ----- | ---- | ------- | ------- | ------------------------------------------------------------------------------------------- |
| id            | int4      | 10         |       |      |         |         | Primary Key                                                                                 |
| name          | varchar   | 2147483647 |       |      | null    |         | Staff or User's full name                                                                   |
| user\_id      | varchar   | 2147483647 | √     |      | null    |         | unique user\_id that will refer ATS database entry.                                         |
| email         | varchar   | 2147483647 | √     |      | null    |         | Staff/user's email address based on this we will able connetc log-In user and staff member. |
| created\_date | timestamp | 296        |       |      | now()   |         |


# **Master Tables**
status
| Column     | Type    | Size       | Nulls | Auto | Default | Parents                   | Comments |
| ---------- | ------- | ---------- | ----- | ---- | ------- | ------------------------- | -------- |
| id         | int4    | 10         |       |      | null    |                           |          |
| status     | varchar | 2147483647 |       |      | null    |                           |          |
| parent\_id | int4    | 10         | √     |      | null    | ien\_applicant\_status.id |          |
| party      | varchar | 2147483647 | √     |      | null    |                           |          |
| full\_name | varchar | 2147483647 | √     |      | null    |                           |

## ha_pcn
| Column       | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id           | int4    | 10         |       |      | null    |         |          |
| title        | varchar | 2147483647 |       |      | null    |         |          |
| description  | varchar | 2147483647 | √     |      | null    |         |          |
| abbreviation | varchar | 2147483647 | √     |      | null    |         |

## education
| Column | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id     | int4    | 10         |       |      | null    |         |          |
| title  | varchar | 2147483647 |       |      | null    |         |

## location
| Column | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id     | int4    | 10         |       |      | null    |         |          |
| title  | varchar | 2147483647 |       |      | null    |         |

## job_titles
| Column | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id     | int4    | 10         |       |      | null    |         |          |
| title  | varchar | 2147483647 |       |      | null    |         |