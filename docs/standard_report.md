# Standrand Report Sheet

### Report 1: Number of New Internationally Educated Nurse Registrant EOIs Processed

When a new applicant adds to a system, We add a registration_date(To identify the start date of the IEN journey).\
This report shows the number of registered applicants in the specific period(4 consecutive weeks count as a period).\
***If you download "period 10", then it will give results from "period 1" to "period 10".***\
*Note: Period starts from April 1st, 2022(This date may change based on final confirmation from the MOH)*

**Developer Side :**\
It can be done in multiple ways. Here I have explained the SQL query to generate the same report.

Step 1: 
Select all the applicants registed between given duration. `from` date: April 1st, 2022 and `to` date as selected period end_date(for e.g. if you select period 2 then May 26th, 2022 is the end_date here). This is a where condition for the SQL query.
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
We have identified eight countries(US, UK, IRELAND, AUSTRALIA, PHILIPPINES, INDIA, NIGERIA, JAMAICA   KENYA) to segregate it and all others in the "OTHER" column. In this report, we have added the "N/A" column to show applicants with no education history attached.


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

This report shows the applicant's current status/milestone who registered during the period (from April 1st, 2022 to the selected period end date) or before the period (before April 1st, 2021).\
Here we have identified 3 main statuses `Active`, `Withdrawn`, and `Hired`.\
***Note: We will use "to" date only and not "from" date. Because we also have to fetch and count applicants who registered before "from" and "to" duration.***

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.


Here we do not have full stop status/milestone, so an applicant can be withdrawn after being hired or reactive their application after withdrawal or hold their application for some period. In these cases, we must need to see what is a final status of an applicant to segregate it into `active`, '`withdrawn, or `hired`.\
we need to find hired and withdrawn applicants using status-id. 20 for withdrawn and 28 for hire.

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

In this report, we will see how many applicants are there in each milestone related to licensing stage. These data will be fetched for the given duration only(`from` and to `date`).\
But we will count full/provisional licenses even if these milestones are added before the `from` date.\
e.g. If an applicant received a full license before "April 1st, 2021" then that applicant will be considered as an active applicant who is looking for a job so we will show it in the `Granted full licensure` row in the report.
***Note: If applicants are active and lastest milestone not in licensing stage and do not have full/provisional license, we need to ignore those applicants from this report***

**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.

There is more than one milestone with each intermediate group/stage in the licensing stage/category. So here we have to group by some milestones to match the reporting requirements.
E.g. "Applied to NNAS", for the same we have at least 3 milestones so we need to aggregate the count for all NNAS-related milestones to one.

Step 1:
Let's find active applicants and remove all hired and withdrawn from the selection list.\
We will apply only `to` date and intake, license, and recruitment category in the milestone table.\
As if the applicant gets hired then-latest milestone may be in the immigration category, that's why we are restricting it up to the recruitment category.
Here we have to ignore hired applicants so we are checking data in the recruitment category.

Subquery: Select all the active applicants by removing hired and withdrawn. We can achieve it by finding the highest milestone in the intake, licensing, and recruitment category and then checking whether its value is 20(withdrawn) or 28(hired) or not.

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
For that, we will use UNION all again with a static filter on milestone one query for full, and one query for provisional.




***
### Report 6: Number of Internationally Educated Nurse Registrants in the Recruitment Stage

Applicants can apply for multiple job-competition under the same health authorities or different health authorities.\
In this report, if an applicant has applied in more than one job competition then that applicant count must be shown multiple times in different HA-related job competitions in the report.

We will fetch all the job-competition data till the `to` date, We do not apply a filter on the `from` date because the applicant may be active but the milestone date is earlier than the `from` date.

e.g.
The applicant applied for 3 job competitions (1 in FHA and 2 in IHA). Please find the latest status of each job competition below.
FHA - Prescreen completed
IHA - Interview Completed
IHA - Offered Position

Here this candidate will appear 1 time in FHA "Prescreen completed" and  2 times in IHA, in "Offered Position" and "interview Completed".


**Developer Side:** \
It can be implemented in multiple ways. Here I have explained the SQL query to generate the same report.

Step 1:
From the job competition and milestone data, we have to find all the job-competition with their latest status for applicants before the `to` date.

Step 2:
Now we have to find applicants count for each HA(connected with job competition) along with selected milestones. To achieve that we can run GROUP BY on HA and milestone.


Looks like we have all the data that we can display in the report.

Step 3:
Let's add new columns of HA and put applicants count for each milestone row. So we can create a matrix with milestone-HA.

Step 4:
Here we have to add 0 for all the blank cells. For that, we will add 0 value for each using UNION ALL.

Let's combine steps 3 & 4 to get the final report in the requested format.



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
