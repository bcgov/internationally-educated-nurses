# SYNC Applicants data from ATS to IEN
HABC has a system called ATS, where all the registered applicants' details are stored and provided APIs to fetch data. This document contain all the avaible APIs list and basic details.
​
## **APIs Documentation**
APIs list receives from the HMBC side.
​
### **A list of staff**
- **API:** https://ien.heabc.bc.ca/staff
- **Note from HMBC:**
    - Staff now requires the API key. This is because we are adding the email address of staff to this api so it can be mapped from your end to other IDs if needed
    - Added the email address. (please note that this is the real email address of staff. This is not “mock data” because it needs to map properly from your end even for testing. That’s why I 
    - Note: The id here is mapped to the staff id (same value for the HMDB User Id). This info is just for reference
- **IEN applicantion**
    - fetched data stores in ien_users table.
​
### **A list of health authorities**
- **API:** https://ien.heabc.bc.ca/HealthAuthority
- **Note from HMBC:**
    - Found inconsistent data (2 lists are being used for HA). This will not effect your end. I will work with HM on how to address this. I cleaned up the api to keep things simple and consistent from your end.
- **IEN applicantion**
    - fetched data stores in ien_ha_pcn table.
​
### **A list of "Candidate Withdrew" reasons**
- **API:** https://ien.heabc.bc.ca/Reason 
- **Note from HMBC:**
    - We still do not have the finalized list.
- **IEN applicantion**
    - fetched data stores in ien_status_reasons table.
    - Here we have two separate columns, one is ien_progran, and the other is recruitment. That helps to filter the reasons for the specific milestone.
    
​
​
​
### **A list of milestones**
- **API:** https://ien.heabc.bc.ca/Milestone
- **Note from HMBC:**
    - The Category for now is hard-coded because ATS has no category. I will up later when we finalize the list.
- **IEN applicantion**
    - fetched data stores in ien_applicant_status table.
    - Intake, Licensing, Recruitment, Immigration, and Final. These categories are hard coded in the IEN application too.
    - Note: the finalized list of milestones was updated on the 2nd week of June(2022), But those new references are not attached with applicants yet.
    - This list is set to fetch once per month on the 15th. This is temporary and will revert to every day once the ATS api is updated
​
​
### **A list of applicants**
- **API:** https://ien.heabc.bc.ca/Applicant
- **Note from HMBC:**
    - the main end point for the applicants. This endpoint is protected by ApiKey
    - Countries: We discussed using ISO for the country list but I found that some countries used in HA are not in the ISO (for example not recognized as a country by ISO). This may mean we will not use ISO codes and use text for the country but for now please continue using the ISO. I cleaned up as much as I can from my end.
    - Added the following parameters to the Applicant API. These are used as a url parameter. For example: https://ien.heabc.bc.ca/applicant?cfrom=2022-03-24&cto=2022-03-24
        - from (optional): yyyy-mm-dd will return if CREATE or UPDATE date from (>=) the specified date
        - to (optional): yyyy-mm-dd will return if CREATE or UPDATE date to (<=) the specified date
        - cfrom (optional): yyyy-mm-dd will return if CREATE date from (>=) the specified date
        - cto (optional): yyyy-mm-dd will return if CREATE date to (<=) the specified date
        - ufrom (optional): yyyy-mm-dd will return if UPDATE date from (>=) the specified date
        - uto (optional): yyyy-mm-dd will return if UPDATE date to (<=) the specified date
        - offset (optional): for paging eqv to skip.
        - Next (optional): the number of records to be returned. Default to 40 records only at the time.
    - Country of Citizenship is now a list.
- **IEN applicantion**
    - fetched data stores in ien_applicants table.
    - fetched milestones attached with applicants stores in ien_applicant_status_audit table.
        - Here we have used applicant_id, status_id, and start_date of any added milestone as a unique value. That helps us to **upsert** data in the IEN database.
​
***
## **Implementation**
We have set up lambda function and trigger on pre-defined intervals to sync data from ATS to IEN application.
​
### Setup
Three AWS components are set up here, you can find the definition in the `terraform/lambdafunction.tf` file.\
For now, we have set up schedulers with 24 hours intervals.
- Lambda:
    - It uses the same build as API.
    - when the lambda function trigger, It will call `handler()` from file `apps/api/src/syncdata.ts`.
- Scheduler (sync master data):
    - It contain input value `{path: "master-data"}`.
    - This input value will be checked in lambda to trigger a predefined service function in `apps/api/src/applicant/external-api.service.ts`.
    - It will sync Milestones, Health authorities, Staff, and "Candidate Withdrew" reasons.
- Scheduler (sync applicant data)
    - It contain input value `{path: "applicant-data"}`.
    - This input value will be checked in lambda to trigger a predefined service function in `apps/api/src/applicant/external-api.service.ts`.
​
### Key notes:
- Master tables are upsert using the `id` column value.
- Applicant's data are upsert using the `applicant_id` column value.
- Applicant milestone/status upsert using `applicant_id`, `status_id`(milestone_id), and `start_date`(date of milestone/status).
- If the lambda function fails and does not sync data properly. It will mark as failed attempt and stored as a record in the IEN database table `sync_applicants_audit`.
    - It will pick the last successful sync date as `from` value and trigger again. That helps us to fetch data from all the previous days till the last successful attempt.
    - This table(`sync_applicants_audit`) has an API endpoint that fetches the last successful data sync. This data shows in an IEN application UI for reference.