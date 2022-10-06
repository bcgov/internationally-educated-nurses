This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This app provides a platform intended to record reporting statistics involved with an Internationally Educated Nurse's hiring journey.  IEN is only responsible for Recruitment related milestones, all other data is submitted to the IEN portal through ATS\

> ** Authentication **\
> See [Authentication](../../README.md#authentication)

## Pages 
***Each page requires particular roles and each role grants certain privileges.\
Depending on roles, pages may look different***
### Landing Page (Manage Applicants Table)
Two similar but different versions depending on the type of logged in user.  

- HA users will have access to a limited version of the table, only being able to see applicants referred to their HA whom are part of the Recruitment stage.  
- HMBC users will have full access to the table, all applicants and phases of the process will be visible

## Reporting
Contains the [Data Extract](https://github.com/bcgov/internationally-educated-nurses/blob/main/docs/data_extract.md) and [Standard Report](https://github.com/bcgov/internationally-educated-nurses/blob/main/docs/standard_report.md)

## User Management
Allows the management/ control of user access and roles
## Last Sync
Displays the most recent Sync time between IEN and ATS.  Scheduled at a daily occurence `(8:00AM UTC - 1:00AM PST for applicants` and `7:00AM UTC - 12:00AM PST for master)`
## Formik form and validation

[Formik](https://formik.org/docs/overview) validates the fields with DTOs and [class-validator](https://github.com/typestack/class-validator) annotations.

## Tailwind CSS

A CSS framework you can easily customize by editing [tailwind.config.js](tailwind.config.js)

## Running the app

Refer to [How to run the apps](../../README.md#how-to-run-the-apps).

## Test

Refer to [Tests](../../README.md#cypress-e2e-tests)

## Learn more

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.