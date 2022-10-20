# **Applicant/ Employee Tables**
## applicants
This table stores only the applicant's tombstone data. Its source of truth is HMBC's ATS system.

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


## audit
This is the applicant audit table, It stores add/update action-related audits if any changes have been made to the applicant form IEN application. It does not store any change that is made on the ATS system.
| Column        | Type      | Size       | Nulls | Auto | Default                                             | Parents            | Comments |
| ------------- | --------- | ---------- | ----- | ---- | --------------------------------------------------- | ------------------ | -------- |
| id            | serial    | 10         |       | √    | nextval('ien\_applicant\_audit\_id\_seq'::regclass) |                    |          |
| data          | json      | 2147483647 | √     |      | null                                                |                    |          |
| created\_date | timestamp | 296        |       |      | now()                                               |                    |          |
| applicant\_id | uuid      | 2147483647 | √     |      | null                                                | ien\_applicants.id |          |
| added\_by\_id | int4      | 10         | √     |      | null                                                | ien\_users.id      |

## status_audit
This table keeps track of each milestone/status added to the applicant record. IEN is responsible for only recruitment milestones. Other milestones like intake, licensing, and immigration sync from the ATS system.
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



## jobs
It stores job-competition data separately for each applicant.

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
It's a pivot table that stores many-to-many relations between jobs and communities/locations.
| Column                   | Type | Size | Nulls | Auto | Default | Parents                 | Comments |
| ------------------------ | ---- | ---- | ----- | ---- | ------- | ----------------------- | -------- |
| ien\_applicant\_jobs\_id | int4 | 10   |       |      | null    | ien\_applicant\_jobs.id |          |
| ien\_job\_locations\_id  | int4 | 10   |       |      | null    | ien\_job\_locations.id  |

## assigned_to_ien_users
It's a pivot table that stores many-to-many relations between applicant and user table.
| Column              | Type | Size       | Nulls | Auto | Default | Parents            | Comments |
| ------------------- | ---- | ---------- | ----- | ---- | ------- | ------------------ | -------- |
| ien\_applicants\_id | uuid | 2147483647 |       |      | null    | ien\_applicants.id |          |
| ien\_users\_id      | int4 | 10         |       |      | null    | ien\_users.id      |

## ha_pcn_ien_ha_pcn
It's a pivot table that stores many-to-many relations between applicant and health authorities table.
| Column              | Type | Size       | Nulls | Auto | Default | Parents            | Comments |
| ------------------- | ---- | ---------- | ----- | ---- | ------- | ------------------ | -------- |
| ien\_applicants\_id | uuid | 2147483647 |       |      | null    | ien\_applicants.id |          |
| ien\_ha\_pcn\_id    | int4 | 10         |       |      | null    | ien\_ha\_pcn.id    |

## employee
It stores signup user detail along with organisation, role, and keyClock unique id.
| Column        | Type      | Size | Nulls | Auto | Default              | Parents | Comments |
| ------------- | --------- | ---- | ----- | ---- | -------------------- | ------- | -------- |
| id            | varchar   | 36   |       |      | uuid\_generate\_v4() |         |          |
| created\_date | timestamp | 296  |       |      | CURRENT\_TIMESTAMP   |         |          |
| updated\_date | timestamp | 296  |       |      | CURRENT\_TIMESTAMP   |         |          |
| name          | varchar   | 128  |       |      | null                 |         |          |
| email         | varchar   | 128  | √     |      | null                 |         |          |
| role          | varchar   | 128  |       |      | null                 |         |          |
| organization  | varchar   | 128  | √     |      | null                 |         |          |
| keycloak\_id  | varchar   | 128  |       |      | null                 |         |

## ien_users
It stores staff members' data, Its source of truth is the ATS system. It holds reference in applicant assined_to and milestone added_by, in IEN and ATS both systems.
| Column        | Type      | Size       | Nulls | Auto | Default | Parents | Comments                                                                                    |
| ------------- | --------- | ---------- | ----- | ---- | ------- | ------- | ------------------------------------------------------------------------------------------- |
| id            | int4      | 10         |       |      |         |         | Primary Key                                                                                 |
| name          | varchar   | 2147483647 |       |      | null    |         | Staff or User's full name                                                                   |
| user\_id      | varchar   | 2147483647 | √     |      | null    |         | unique user\_id that will refer ATS database entry.                                         |
| email         | varchar   | 2147483647 | √     |      | null    |         | Staff/user's email address based on this we will able connect log-In user and staff member. |
| created\_date | timestamp | 296        |       |      | now()   |         |


# **Master Tables**
## status
It stores milestone data. If parent_id is NULL, that will be a category and only add/update using the seed/migration file. We have identified five categories intake, licensing, recruitment, immigration, and final.
| Column     | Type    | Size       | Nulls | Auto | Default | Parents                   | Comments |
| ---------- | ------- | ---------- | ----- | ---- | ------- | ------------------------- | -------- |
| id         | int4    | 10         |       |      | null    |                           |          |
| status     | varchar | 2147483647 |       |      | null    |                           |          |
| parent\_id | int4    | 10         | √     |      | null    | ien\_applicant\_status.id |          |
| party      | varchar | 2147483647 | √     |      | null    |                           |          |
| full\_name | varchar | 2147483647 | √     |      | null    |                           |

## ha_pcn
Health Authorities
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
Local communities
| Column | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id     | int4    | 10         |       |      | null    |         |          |
| title  | varchar | 2147483647 |       |      | null    |         |

## job_titles
job title/departments
| Column | Type    | Size       | Nulls | Auto | Default | Parents | Comments |
| ------ | ------- | ---------- | ----- | ---- | ------- | ------- | -------- |
| id     | int4    | 10         |       |      | null    |         |          |
| title  | varchar | 2147483647 |       |      | null    |         |



# **Triggers**
To perform specific queries Before/After Insert/Update/Delete operation on the selected table.
### **trg_job_updated_date_on_status**
Job-competition `updated_date` must be updated if we add or modify any milestone related to that. To achieve this, we have added a trigger on the `status_audit` INSERT or UPDATE operation.\
Added a function `job_updated_date()` that will call when the trigger execute(Postgres trigger works based on function).



# **Indexes**
Primary key, Foreign key, and Unique column generated when table adds/updated.
But for some use cases, we need to add additional indexes like TEXT or Composite/Partial Primary/Unique key.

### **Composite Unique key**
**unique_applicant_status_date**
Uniquely identify row base on 3 columns applicant_id, status_id, start_date on `status_audit` table.\
It helps to run upsert operations while syncing data from ATS.

**unique_applicant_status_date_job**
Uniquely identify row base on 3 columns applicant_id, status_id, start_date, job_id on `status_audit` table.\
It helps to run upsert operations while syncing data from ATS.

# How to connect to IEN DEV database on AWS

1. Login to AWS LZ2

1. Select dev instance
    1. Select ‘Click for Credentials’, copy to clipboard and paste in notepad
    1. Select ‘Login to Console’

1. Once in AWS page, search for Session Manager

1. Click ‘Start session’

1. Take the bastion ‘Instance ID’ value, then select ‘ien-dev-bastion’ radio and click ‘Start session’ (a new window should appear with a blank terminal)

1. Go back to IEN project and open the .env file in root

1. Add bastion Instance ID to ‘BASTION_INSTANCE_ID’ or make sure current value matches

1. Go back to AWS console
    1. Search for RDS
    1. Click ‘Databases’ on sidebar    
    1. Click ‘ien-dev-db’    
    1. Copy ‘Endpoint name’ (Writer or Reader, whichever meets your needs)
    1. Go back to .env file and add endpoint name to ‘DB_HOST’

9. Go to terminal and make sure you’re in the root folder of the IEN project
    1. Here we will paste the AWS LZ2 credentials we copied in step 2

        (Note: on Windows, by default the terminals don’t support multi-line pasting, so you need to either download one or paste one by one)

    1. After entering all the credentials, run the command ‘make open-db-tunnel’
    
        Some fun stuff should happen in the terminal and the prompt should be replaced with something similar to ‘ssm-user@.....’

10. We’re now almost ready to connect locally, one more variable is needed
    1. Go back to AWS
    1. Search for Lambda    
    1. Look for the Function ‘ien-dev-syncdata’    
    1. Select it and go to ‘Configuration’ tab    
    1. Find and copy ‘POSTGRES_PASSWORD’ value

11. Open up Postgres (pgAdmin)
    1. Create a new Server
    1. Add a name (ex. ien_dev)
    1. Click Connection tab
    1. Enter these values
        1. Host: localhost
        1. Port: 5454
        1. Username: freshworks
        1. Password: Value you copied in step 10.5

12. Hit Save and you should be good to go!