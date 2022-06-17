# Internationally Educated Nurses hiring portal project. 

[![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)]()
The codebase is being roughed out, but finer details are likely to change.

## Project structure

### Tech stack

- Runtime environment - NodeJS
- Programming language - Typescript
- Database - PostgreSQL
- Authentication - Keycloak
- Backend API server - NestJS
    - Express
    - TypeORM
    - Swagger
- Frontend React framework - NextJS
    - Formik
    - Tailwind CSS
    - class-validator
    - Cypress
- Deployment
    - GitHub Actions
    - Terraform
    - AWS CloudFront/S3/Lambda/RDS

### Yarn workspaces

| Workspace or Package   | Description                   | README                                     |
|------------------------|-------------------------------|--------------------------------------------|
| apps/api               | Backend **NestJS** API server | [README](apps/api/README.md)               |
| apps/web               | Frontend **NextJS** React app | [README](apps/web/README.md)               |
| packages/common        | Shared library                | [README](packages/common/README.md)        |
| packages/accessibility | **Accessibility** Test        | [README](packages/accessibility/README.md) |

## PR Checks

When you create a pull request, be aware that GitHub actions for each project will be executed to check its validity.

- [pr-check-api](.github/workflows/pr-check-api.yml) - format, lint, unit and integration tests
- [pr-check-web](.github/workflows/pr-check-web.yml) - format, lint, and test
- [pr-check-common](.github/workflows/pr-check-common.yml) - format, lint, unit tests, and build
- [pr-check-e2e](.github/workflows/pr-check-e2e.yml) - run cypress e2e and accessibility tests
- [pr-check-terraform](.github/workflows/pr-check-tf.yml) - show terraform plan

## How to run the apps

### Preparation

- Install NodeJS 16+ as a runtime environment by [nvm](https://github.com/nvm-sh/nvm)
- Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) as a package manager
- Install and run [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Check out the repository
  ```bash
  $ git clone https://github.com/bcgov/internationally-educated-nurses ien
  $ cd ien
  ```
- Install dependencies
  ```bash
  $ yarn
  ```
- Define environment variables in .env

  Copy [.env.example](.config/.env-example) to .env

  ```bash
  $ cp .config/.env.example .env
  ```

  Define variables for database connection.
  ```
  PROJECT=ien
  RUNTIME_ENV=local
  POSTGRES_HOST=db
  POSTGRES_USERNAME=
  POSTGRES_PASSWORD=
  POSTGRES_DATABASE=
  ```
  > **Database Initialization**
  >
  > The local `.pgdata` folder is mapped to a volume in db container, and it is initialized at the initial launch. If you change env variables to authenticate a db connection, delete `.pgdata` so that database could be reinitialized.

  > **Slack Integration**
  >
  >`SLACK_ALERTS_WEBHOOK_URL=`
  >
  > If SLACK_ALERTS_WEBHOOK_URL is defined and an exception occurs, the error message will be sent to the Slack channel.

### Run as docker containers

The `Make` command `docker-run` to build and launch containers is defined in [Makefile](Makefile).

- create containers

  ```bash
  $ make docker-run
  ```

- stop containers

  ```bash
  $ docker-compose stop
  ```
  
- start containers
  
  ```bash
  $ docker-compose start
  ```

- destroy containers

  ```bash
  $ make docker-down
  ```
  
Containers:
- ien_db
- ien_common
- ien_web
- ien_api

Containers are configured by [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml)

> If you get a **DockerException**, make sure Docker Desktop is running.

```
docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', ConnectionRefusedError(61, 'Connection refused'))
[80774] Failed to execute script docker-compose
```

### Run as local NodeJS instances

It is recommended to run database as a container in any case. On the other hand, you can run `common`, `api`, and `web` as NodeJS instances.

```bash
$ make start-local
```

or run in `watch` mode

```bash
$ make watch
```

### Make apps connect to each other.

> **Database Hostname Resolution**
>
> `POSTGRES_HOST` env is defined as `db`, which is used as a service name in [docker-compose.yml](docker-compose.yml). As `api` uses it to connect to the database and a service name is resolved as an address only in Docker environment, you need to redefine it to resolve it on your local machine. You can set it to `localhost` if you persistently run the app in this way. Otherwise, add `127.0.0.1 db` to `/etc/hosts`.

> **API Calls**
>
> `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`
>
> To make successful requests from `web` to `api`, you need to set `NEXT_PUBLIC_API_URL` environment variable. It is set by default when using Docker or run by `make` command, but if you run the application by `next start` command in `apps/web` folder, you should supply this value by creating a file named `.env.local` placed in `apps/web`.

> In order to make breakpoints work in `watch` mode, set `sourceMap` to `true` in [tsconfig.json](tsconfig.json) and restart the apps.

## Tests

Unit and integration tests run against the API in the CI pipeline on pull request.

### Manual API Tests

Requests to all endpoints are defined in FreshWorks's Postman IEN workspace. Except `version` endpoint, all require authentication. IEN collection's [pre-request](./docs/postman.md) script authenticates and saves `token` as an environment variable before each call.

> Note that it only works for the `local` and `dev` environments because they use different Keycloak servers. See [deployments](#deployments) section. To query for the `test` and `prod`, unset `username` and `password` environment variables and set `token` with the one retrieved from the response of login request in the browser.
> 
### Unit Tests

Run API and web unit tests with `make api-unit-test` and `make web-unit-test`.

### Integration test

#### Ephemeral test data

`api` and  `web` integration tests start test database with `clean` data before running tests and destroy it after.

> ```
>	@make start-test-db
>	@yarn build
>	@NODE_ENV=test yarn test:e2e
>	@make stop-test-db

The test database container has no mapped volume. Therefore, all data will be deleted when the container is removed by `make stop-test-db` command.

#### API Integration Tests

Run API integration tests with `make api-integration-test`

#### Cypress e2e Tests

Run Cypress integration tests with `make test-e2e` or `make test-web`. `test-web` runs pa11y if cypress tests succeed. 

If you want to open Cypress UI while developing new test cases, run `make run-test-apps` to prepare applications and then run `make open:cypress` 

> **Seed data**
> 
> Login test case should be run to seed a test account and applicants before running any other cases requiring logging in.

> **Cypress session**
> 
> Authentication with Keycloak is a little expensive and time-consuming. To reduce interaction with it, call `cy.login()` before each test case, then it creates a new session by destroying the existing one. Therefore, you don't need to call logout explicitly after each test case. When logging in with a user of different role, pass its id as a parameter.
> 
> `cy.login('ien_e2e_hmbc')`
> 
> All test users should have the same password.

#### Accessibility Tests

See accessibility [README](./packages/accessibility/README.md)

## Deployments

### Workflow and environments

We have four environments where we run the application: local, development, test, and production.

- `local` is normally each developer's laptop or workstation. [How to run the app](#how-to-run-the-apps) section is meant for it.
- `dev`, `test`, and `prod` are on OCIO Cloud Platform - AWS LZ2 with project code of `uux0vy`. They are provisioned by the same IaC but with a little different variables.

The standard process of deployment goes through the following steps.

1. Run and test the app on local environment while implementing a new feature. Once the task is done,
2. Create, review, and merge a pull request,
3. Deploy to `dev`. Developers verify the app,
4. Deploy to `test`. QA team verify the app; Clients might use `test` to confirm that the app is ready to be released.
5. Deploy to `prod` with approval.

To trigger deployment, run `make tag-{env}`. ex) `make tag-dev`

`test` and `prod` deployments to AWS are managed through Terraform configurations and GitHub actions. They do not require access to LZ2. However, in order to access LZ2 for updating parameters, troubleshooting, or diagnosing the app, your IDIRs would have to be onboarded on to LZ2 for the project code `uux0vy` -  IEN.

> **Authentication**
> 
> `local` and `dev` use FreshWorks's Keycloak server at https://keycloak.freshworks.club.
> ``
> `test` and `prod` use Ministry of Health's Keycloak server at https://common-logon-test.hlth.gov.bc.ca and https://common-logon.hlth.gov.bc.ca 
> 
> The notable difference is that MoH Keycloak doesn't allow `direct access grants`. Therefore, you can't use [pre-request](docs/postman.md) to authenticate on Postman.

#### Infrastructure and Deployments:

The AWS infrastructure is created and updated using Terraform and Terraform Cloud as the backend.

The TFC keys required to run terraform can be found in SSM store in AWS.

Make commands are listed under `terraform commands` in Makefile for initialization, plan and deployment of resources.

Service accounts are created with IAM permissions to deploy cloud resources such as - S3 static file uploads, update lambda function, cloudfront invalidation etc.

#### Production Release:

All changes in `main` branch are released to production by tagging `make tag-prod` along with the version number of the release.

This creates a release tag and also a production tag, deploying to production, once approved by the Leads / DevOps team members.

As a part of the production release approval:

1. Validate the latest ZAP scan results to ensure no new vulnerabilities are introduced.
1. Review the latest code quality analysis results in Sonar Cloud to ensure no new vulnerabilities are introduced.

### Database Backup restore

Database backups occur on every deployment and also during the scheduled backup window.

To restore the database form a backup the following steps need to performed in the specified order

* Find the snapshot to restore from the AWS console 
* snapshots created during a build are tagged with the commit sha
* Uncomment everything from the file `terraform/db_backup.tf`
* Comment everything from the file `terraform/db.tf`. **This deletes the existing RDS cluster**. If any debugging needs to be done on the bad rds cluster do not do this step
* Update local var `snapshot_name` to the snapshot name from the console
* Uncomment the line `POSTGRES_HOST     = aws_rds_cluster.pgsql_backup.endpoint` from `terraform/api.tf`
* Comment out the line  `POSTGRES_HOST     = aws_rds_cluster.pgsql.endpoint` from `terraform/api.tf`
* Run `ENV_NAME=prod make plan` and `ENV_NAME=prod make apply`. *Change ENV_NAME based on the needs*
* This should create a new rds cluster from the snapshot provided and update api to point to the new backup cluster

## Security Requirements:

All BC gov projects must pass the STRA (Security Threat and Risk Assessment Standard) and maintain the approved SoAR

More details on STRA [here](https://www2.gov.bc.ca/gov/content/governments/services-for-government/information-management-technology/information-security/security-threat-and-risk-assessment)

Regular review of ZAP Scan and Sonar Qube results must be performed. Especially before release to production.

[comment]: # "@TODO update link to the latest STRA"

Current STRA and SoAR [here](link)

> Portal should be SSL, process for certificate renewal - [Refer](./cert/readme.md)
