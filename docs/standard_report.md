# Standard Report Sheet

### Report 1: Number of New Internationally Educated Nurse Registrant EOIs Processed

When a new applicant adds to a system, We add a registration_date(To identify the start date of the IEN journey).\
This report shows the number of registered applicants in the specific period(4 consecutive weeks count as a period).\
***If you download "period 10", then it will give results from "period 1" to "period 10".***\
*Note: Period starts from May 2nd, 2022(This date may change based on final confirmation from the MOH)*

**Developer Side :**\
It can be done in multiple ways. Here I have explained the SQL query to generate the same report.

Step 1: 
Select all the applicants registed between given duration. `from` date: May 2nd, 2022 and `to` date as selected period end_date(for e.g. if you select period 2 then May 26th, 2022 is the end_date here). This is a where condition for the SQL query.
While selecting applicants let's find in which period they are in, to calculate period do 
```from-date - registration_date / 28```, here we took 28 days due to 4 week duration.\
*note: It return integer and not decimal, But if you query return float/decimal value cast or apply floor() to get integer value*\

Now, Let's apply GROUP BY and ORDER BY on period.

Step 2:
Here we have temp result with period as integer, Let's find start and end date of each existing periods.

*Note: Latest period's end maybe a future date, We will handle it and change future date to today's date in javascript code*

***
### Report 2: Country of Training of Internationally Educated Nurse Registrants

Same as the above report in terms of period calculation. Here we further segregate it as country-wise.\
An applicant may have completed their education in different countries. Here the highest education based on the passing year will be considered to track the country to generate this report.\
There are 9 countries that HMBC has identified(US, UK, IRELAND, AUSTRALIA, PHILIPPINES, INDIA, NIGERIA, JAMAICA, KENYA) to segregate it and all others in the "OTHER" column. In this report, we have added the "N/A" column to show applicants with no education history attached.


**Developer Side :**\
It can be implement in multiple ways. Here I have explained the SQL query to generate the same report.

Step 1:
We are storing Nursing education as a JSON. It holds an array of nursing education objects that contain title, country, and year.\
Let's select all applicants who are registered in the selected period duration using the WHERE clause.\
In same query got to the SELECT clause and selected the column nursing education, Let's apply some JSON functions, and sort is based on the passing year, after sorting select latest record contry. If nursing_education is null then mark it as 'n/a'.\

Step 2:
We have identified 8 countries to show in the report and all others will be counted in the 'Other' column. This segregation did with the CASE statement in the query.\

 \
 Now we have a temporary table with column applicant.id, period, and country. These data are sufficient enough to generate our desired report. Let's put this result in report format.\
  \
Step 3:
Let's add additional columns in the above temporary result, columns are an applicant.id, period, 8 countries, 'other' and 'n/a'.\
For each row, if Applicant country matches then put 1 else 0.

Step 4:
Let's run GROUP BY and ORDER BY on period to generate the final report format.

Step 5:
If we want to add a new (an additional) row to show the sum for each country, please add this line, or you can handle it in Javascript code.



***
### Report 3: Status of Internationally Educated Nurse Registrant Applicants

This report shows the applicant's current status/milestone who registered during the period (from May 2nd, 2022 to the selected period end date) or before the period (before May 2nd, 2022).\
*It is likely to change and new period will be 1) Before May 2nd, 2022, and 2) May 2nd, 2022 to current. We are waiting to final confirmation from MOH side on this.*\
Here we have identified 3 main statuses `Active`, `Withdrawn`, and `Hired`.\
***Note: We will use "to" date only and not "from" date. Because we also have to fetch and count applicants who registered before "from" and "to" duration.***

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.


Here we do not have full stop status/milestone, so an applicant can be withdrawn after being hired or reactive their application after withdrawal or hold their application for some period. In these cases, we must need to see what is a final status of an applicant to segregate it into `active`, `withdrawn`, or `hired`.\
we need to find hired and withdrawn applicants using status-id.\
 `Withdrew from IEN program (Licensing/Registration)` or `Candidate Withdrew from Competition (Recruitment)` with outcome reason `Withdrew from IEN Program` for withdrawn.\
 `Job Offer Accepted` for hired.


Step 1:
Find all the withdrawal applicants till `to` date. And from all those withdrawn applicants, remove re-active applicants(who have started their process again with the latest milestone).\
This can be done using sub query or we can divide it into 2 queries and use the temporary result as well.

Step 2:
Now let's find hired applicants. Here apply a condition that the withdrawn milestone date is not greater than hired date.

Step 3:
Now we know all the details, Let's put it as a boolean to find the count using the aggregate function in the next query.
- If the applicant is withdrawn then re-active and not hired yet then that applicant is marked as active.
- If the applicant not hired or withdrawn yet, it will be count as active too.
- If hired is the highest milestone, the applicant mark as Hired one.
- If the applicant has withdrawn and we still don't have any new milestone till the "to" date of the report, then the applicant is marked as withdrawn.


Step 4:
Let's run the group by on date(before and after period dates)(put the date in WHERE clause and apply aggregate function in SELECT clause to achieve this) to generate the final report.



***
### Report 4: Number of Internationally Educated Nurse Registrants in the Licensing Stage

In this report, we will see how many applicants there are in each milestone related to the licensing stage. This data will be fetched for the given duration only(`from` and to `date`).\
But we will count full/provisional licenses even if these milestones are added before the `from` date.\
e.g. If an applicant received a full license before "April 1st, 2021" then that applicant will be considered as an active applicant who is looking for a job so we will show it in the `Granted full licensure` row in the report.
***Note: If applicants are active and their latest milestone is not in the licensing stage and does not have a full/provisional license, we need to ignore those applicants from this report***

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.

There is more than one milestone with each intermediate group/stage in the licensing stage/category. So here we have to group by some milestones to match the reporting requirements.
E.g. "Applied to NNAS", for the same we have at least 3 milestones so we need to aggregate the count for all NNAS-related milestones to one.

Step 1:
Let's find active applicants and remove all hired and withdrawn from the selection list.\
We will apply only `to` date and licensing/ registration and recruitment category in the milestone table.\
If the applicant gets hired then the latest milestone may be in the immigration category, that's why we are restricting it up to the recruitment category.
Here we have to ignore hired applicants so we are checking data in the recruitment category.

Subquery: Select all the active applicants by removing hired and withdrawn. We can achieve it by finding the highest milestone in the intake, licensing, and recruitment category and then checking whether its value is `Withdrew from IEN program (Licensing/Registration)` for withdrawn or `Job Offer Accepted` for hired.

Now you have all the active applicants, Let's find status by checking their full/provisional license (we will select only the latest one if exist).
Here we only apply `to` date, as discussed above if the candidate is looking for a job we have to count them in the `Granted full licensure` row in the report.

Step 2:
For the active applicants only, Here in this query, we will find the latest milestone from the licensing stage during the `from` and `to` date.

Step 3:
Based on queries 1 and 2, we will have the highest status_id/milestone_id and has_licence values for each applicant.\
Based on the above notes, we will ignore all those applicants whose license(full/provisional) and latest licensing status_id are not found.\
 \
Now we have all the data available in a temporary table and we can generate our report format.

Step 4:
Adding a new column can be done in a single query but to add a new row in the final result we have to apply UNION ALL.
For that we have to group some milestone to get the final count. So we will run a select query and filter group of status, than apply aggregate.\
E.g.  "Applied to NNAS" here we need to filter the above temporary table to find the milestone related to NNAS and sum it up.

Now we are ready with all the required rows for our final report. UNION ALL makes it more simple.


***
### Report 5: Number of Internationally Educated Nurse Registrants Eligible for Job Search

We have already found count for provisional and full license applicants looking for a job in the above report till `to` date.\
In this report, we will find out how many applicants received full/provisional licenses during the `from` and `to` date.

**Developer Side:** \
It is pretty straightforward. We need to identify the highest milestone, full or provisional between `from` and `to` date.
Now we have to show it in a separate row.\
For that, we will use UNION all again with a static filter on milestone two queries(LPN/ RN) for full and two queries(LPN/ RN) for provisional.




***
### Report 6: Number of Internationally Educated Nurse Registrants in the Recruitment Stage

Applicants can apply for multiple job competitions under the same health authorities or different health authorities.\
In this report, if an applicant has applied to more than one job competition then that applicant count must be shown multiple times in different HA-related job competitions in the report.

We will fetch all the job competition data till the `to` date, We do not apply a filter on the `from` date because the applicant may be active but the milestone date is earlier than the `from` date.

Now we will categories and select count based on below 2 cases for each cell in report.

Case 1: active applicants (not hired in any HA/job competition and not withdrawn from the process)
e.g.
The applicant applied for 3 job competitions (1 in FHA and 2 in IHA). Please find the latest status of each job competition below:\
FHA - Milestone: Prescreen Completed, Outcome: Candidate Passed Prescreen\
IHA - Milestone: Interview Completed, Outcome: Candidate Passed Interview\
IHA - Referral Acknowledged/ Reviewed\
\
Here this applicant will appear 1 time in FHA "Candidate Passed Prescreen" and  2 times in IHA, in "Candidate Passed Interview" and "Referral Acknowledged/ Reviewed".

Case 2: Hired 
e.g. Applicant got hired in FHA. Now we will count this applicant only one time in the cell ("FHA", "Job Offer Accepted"). and remove this applicant's count from all the other in-process job competitions.
Note: If the applicant got hired in 2 HA/job competitions then we will pick the latest one and drop the others.

***Note: When an applicant gets hired for a job competition (HA). That applicant will be dropped off from all the other pending job competitions.***


**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.

Before starting this process first, we need to find applicants with hired and withdrawal status.
We will ignore withdrawn candidates and only select the final HA/job competition in case of Hired.

Step 1: Select the latest status (Hired or Withdraw)

Step 2: For the withdrawal status let's check if any new milestones logged after it or not.

Step 3:
From the job competition and milestone data, we will find all the job competition with their latest status for applicants till the `to` date. Ignore all the Hired and withdrawn applicants here.
+
Let's find the latest hired HA and use it for the count(It means we are going to drop all the in-process job competition data if the applicant selected in any one HA/job competition)

Step 4:
We will find applicant counts for each HA(connected with job competition) along their selected milestones. To achieve that, we can run GROUP BY on HA and milestone.


Looks like we have all the data that can be display in the report.

Step 5:
Let's add new columns of HA and put applicants count for each milestone row. So we can create a matrix with milestone-HA.

Step 6:
Here we have to add 0 for all the blank cells. For that, we will add 0 value for each using UNION ALL.

Let's combine steps 5 & 6 to get the final report in the requested format.



***
### Report 7: Number of Internationally Educated Nurse Registrants in the Immigration Stage

It is similar to report 6, but here we will look for immigration milestones for `hired` applicants.

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.

Step 1:
Let's find hired applicants with a milestone date less than or equal to `to`.

Step 2:
Let's find the highest milestone from the immigration stage for all hired applicants `to` date. And join the HA table to find HA data.\
Now apply GROUP BY on HA and milestone to creating report-ready data.

Same as report 6,
We will add a new column of HA for each milestone, And UNION ALL with blank data to fill the table with 0 if any cell data is missing.

The final query will generate the report format as per requested.



***
### Report 8: Number of Internationally Educated Nurse Registrants Working in BC

Here we are displaying the applicants count who received the milestone "Received Work Permit (Arrival in Canada)" for the current period and current fiscal along with the total till `to` date.\
If we find the above milestone for the given applicant then we do go back and find job competition with the latest hired milestone.\
Because in the report we are showing all the data related to HA.

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.


Step 1:
Let's find the start_date of the current period. We have already got the start_date of the fiscal year in the `from` date. and end_date `to`, mostly it's current date but if anyone wants to download a report for the past period, then the `to` date will be the last date of the given period.

Step 2:
Let's find all the applicants with the milestone "Received Work Permit (Arrival in Canada)" `to` date. And fetch their related HA and milestone start date.

Steps 3,4,5: we are getting value for each column like current period, fiscal, and to-date.

Step 3:
On the result of step 2, Let's apply the period start and end date to retrieve HA-wise applicants. Apply WHERE clause on date duration and then group by using HA.

Step 4:
Same as step 3 but here we will apply the date duration of the current fiscal.

Step 5:
Same as step 3, but here we will only apply the filter till the `to` date, Because we have to calculate overall applicants.

Step 6:
Apply left join on 3,4,5 to get the final report data.

UNION ALL with aggerage function sum to add a new row for the total count.


***
### Report 9: Average Amount of Time with Each Stakeholder Group

In this report, There are a few groups NNAS, BCCNM & NCAS, Employer(all HA or recruitment wise), Immigration, and Overall. The cherry on top added one more duration which shows the time to hire, Here we are counting duration from the NNAS start date till Hired date from any of the HA.

Before we process further please check the below points, which show which data we are considering in this report.
- Only hired applicants' duration will be calculated, We are ignoring all the active and withdrawn applicants here.
- If the applicant is hired by more than one HA, then we will pick the lastest Hired date & that HA and ignore the previous one.

Now, Let's understand how we are calculating the duration of each stakeholder group.
1. NNAS:
    - We have multiple milestones related to NNAS, like "Applied to NNAS", "Submitted Documents (NNAS Application in Review)", "Received NNAS Report", etc.
    - To calculate duration we need a start and end date. Here we can find the minimum date out of the above-listed milestones group and mark it as the start date. (If no status is found then we won't get any duration. If data is not consistent then we will see such a case)
    - Let's find the end date. In most cases, the end date is found based on the "Received NNAS Report" milestone date. But there is a possibility that applicant data don't have this milestone and start with another milestone like BCCNM or NCAS. In such cases, we will consider the minimum date from the BCCNM, NCAS, and recruitment-related milestones and use it to calculate the duration of NNAS.
    - Using the start and end date we will find the duration for NNAS.
2. BCCNM & NCAS:
    - Same like NNAS we do have multiple milestones to identify this stage duration.
    - To find the start date, we will look into BCCNM, NCAS, and License-related milestones and find the minimum date.
    - To find the end date, we will look into the recruitment-related milestone start date. Here we will have at least one recruitment-related milestone because we are only processed with hired applicants.
    - Using the start and end date we will find the duration for BCCNM & NCAS.

3. Employer:
    - To find the employer duration we have HA's job competition and Hired date. Because we have only selected hired applicants.
    - From the selected job competition we can find minimum and maximum dates to calculate duration.
    - Also we can separate HA under Employer using the same job competition record(Each job competition is attached with one HA).
4. Immigration:
    - Now, here we have to consider 2 main possibilities.
      1. applicant completed their process of immigration and we can use, the last milestone of it to calculate the duration.
      2. If the applicant is still in an immigration state, then we have to consider the `to` date as the end date to calculate duration.
    - We have a start date as a "hired" date and the end date can be found using the above 2 possible cases to calculate duration here.
5. Overall:
    - Start date must be the lowest date of any of the milestones.
    - End date, will be immigration completed or the `to` date if immigration is still in progress.

Note:
- Applicant may put their application on hold for a certain duration. We can audit this by logging it as withdrawn and attaching a withdrawal reason related to holding.
- Here we have to subtract this HOLD/WITHDRAWAL duration from the "Overall" and "Average time to hire". (If the applicant withdraws from the immigration stage then we won't consider it for this report, as we only pick hired applicants)

6. Average time to Hire:
    - We are going to calculate the duration from NNAS to Hired in particular HA here.
    - We will find the NNAS minimum date and Hired date to calculate duration minus any withdrawal time.

We understand how to calculate the duration for each stakeholder group. Let's find MEAN, MEDIAN, and MODE values from the list of available durations. It helps to generate the requested report.
MEAN: It is an average value.
MEDIAN: It is the middle value from the sorted list if the list has an odd number of elements. If values are even in number it will pick 2 values from the middle of the list and show their average.
MODE: It picks the highest occurrence of any value in the given list.
