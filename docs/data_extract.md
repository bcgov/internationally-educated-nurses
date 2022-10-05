# Applicant Data Extract

### Purpose

The Applicant Data Extract provides basic information on all applicants within a given date range `(from, to)`.\
Information includes, but is not limited to, Registration Date, Assigned To, Country of Residence(One)/ Citizenship(Many), PR Status, Referred HA's etc. as well as the start dates for milestones from all phases of the IEN journey.\
- If no applicants fall into the given date range, no data will return and no extract will be downloaded.\
- If no data exists for a column, a blank cell will be shown\

**Developer Side:** \
`Args: (from, to, milestones)`

Step 1: Split up list of `milestones` by creating an array for both the id's and status names \

Step 2: Create Appliciant columns and titles using AS, taking only non-identifiable information\
***A few columns are JSON Arrays so their queries become more complicated.  Ex. Referred Health Authority: requires us to modify the existing status from ATS to get the acronyms for the respective HA.***\

We now have all the columns required for the data extract,

Step 3: Combine Steps 1 and 2 into a SELECT from the Applicants table and JOIN the status audit table.  Here is where we will use the `from` and `to` dates inside a WHERE to retrieve all applicants within the date range
