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

### Tooling

Most commands in this project are wrapped in the [Makefile](Makefile), which loads your
`.env` file and sets the environment variables each command needs. You run them as
`make <target>`, for example `make watch`. Each target simply runs the shell
commands written under it.

```bash
$ make          # list the documented targets with a short description of each
```

## PR Checks

When you create a pull request, be aware that GitHub actions for each project will be executed to check its validity.

- [pr-check-api](.github/workflows/pr-check-api.yml) - format, lint, unit and integration tests
- [pr-check-web](.github/workflows/pr-check-web.yml) - format, lint, and test
- [pr-check-common](.github/workflows/pr-check-common.yml) - format, lint, unit tests, and build
- [pr-check-e2e](.github/workflows/pr-check-e2e.yml) - run cypress e2e and accessibility tests
- [pr-check-terraform](.github/workflows/pr-check-tf.yml) - show terraform plan

## How to run the apps

### Preparation

- Install NodeJS 24.21.0 or later (see `.nvmrc`) as a runtime environment by [nvm](https://github.com/nvm-sh/nvm)
- Enable [Yarn](https://yarnpkg.com/) via corepack, which ships with NodeJS. The version
  is pinned by `packageManager` in [package.json](package.json), so do not install yarn
  separately.

  ```bash
  $ corepack enable
  $ yarn --version   # 4.9.3
  ```

  > nvm gives every NodeJS version its own `bin` directory, so the yarn shim is created
  > only for the version that was active when you ran `corepack enable`. After installing
  > or switching to another NodeJS version, run it again — otherwise make recipes that
  > call `yarn` fail with a confusing `make: yarn: Not a directory`.
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

  Copy [.env-example](.config/.env-example) to .env

  ```bash
  $ cp .config/.env-example .env
  ```

  The defaults in `.env-example` work for local development. The values you are most
  likely to change are the database credentials and the local Keycloak password.

  ```
  PROJECT=ien
  RUNTIME_ENV=local
  POSTGRES_HOST=localhost
  POSTGRES_USERNAME=
  POSTGRES_PASSWORD=
  POSTGRES_DATABASE=
  KEYCLOAK_LOCAL_PASSWORD=local
  ```

  > **Database host**
  >
  > Keep `POSTGRES_HOST=localhost`. It is correct when the api runs on your machine, and
  > [docker-compose.local.yml](docker-compose.local.yml) overrides it to the service name
  > `db` when the api runs in a container, so one value serves both ways of running.

  > **Database Initialization**
  >
  > The local `.pgdata` folder is mapped to a volume in db container, and it is initialized at the initial launch. If you change env variables to authenticate a db connection, delete `.pgdata` so that database could be reinitialized.

  > **Teams Integration**
  >
  >`TEAMS_ALERTS_WEBHOOK_URL=`
  >
  > If TEAMS_ALERTS_WEBHOOK_URL is defined and an exception occurs, the error message will be sent to the Teams channel.

- Provide a certificate file at `cert/zscaler-root-ca.pem`

  [Dockerfile.local](Dockerfile.local) always copies this file, so the image build fails
  without it. If your organization inspects TLS traffic, export your root certificate as
  described in [Enterprise TLS/SSL Interception](./cert/README.md#enterprise-tlsssl-interception).
  If it does not, any valid certificate bundle satisfies the copy, for example
  `cp /etc/ssl/certs/ca-certificates.crt cert/zscaler-root-ca.pem`. Certificate files are
  gitignored.

### What you will be running

| Service | Address | Notes |
|---|---|---|
| web | http://localhost:3000 | NextJS frontend |
| api | http://localhost:4000/api/v1 | NestJS backend, Swagger UI at http://localhost:4000/api |
| database | localhost:5432 | PostgreSQL, container `ien_db` |
| Keycloak | http://localhost:8080 | Authentication, container `ien_keycloak`, admin console login `admin` / `admin` |
| test database | localhost:5433 | Used only by the test suites, wiped between runs |

All of these are defined in [docker-compose.local.yml](docker-compose.local.yml). There
are two supported ways to run them.

### Option A: every service in Docker

```bash
$ make docker-run-local     # builds the images, then starts db, common, api, web and Keycloak
$ make seed-local           # in a second terminal
```

`docker-run-local` stays in the foreground and prints the logs of all services, so run
`seed-local` from another terminal. It waits until the api has finished its database
migrations before loading the sample data.

### Option B: api and web on the host, with hot reload

```bash
$ make watch                # starts db and Keycloak in Docker, runs common, api and web on your machine
$ make seed-local           # in a second terminal
```

Use this while developing. Code changes are picked up without rebuilding an image.
`make start-local` does the same thing without hot reload.

> Do not use both options at the same time. They both bind ports 3000 and 4000.

> **Times can differ between the two options.** Database timestamps are stored as UTC
> without a zone, and the api reads them in its own process timezone. In Docker (Option A),
> as on AWS Lambda, that is UTC, so times are correct. With Option B the api runs in your
> machine's timezone, so times read back shifted.
>
> | `sync_applicants_audit.updated_date` | Option A (Docker) | Option B (`make watch`, Vancouver machine) |
> |---|---|---|
> | `2026-09-15 20:00:00` | Last Sync: `Sep 15, 2026 1:00 PM` | Last Sync: `Sep 15, 2026 8:00 PM` |
>
> To avoid it, run the api in UTC:
>
> ```bash
> $ TZ=UTC make watch
> ```
>
> Never set `TZ` on the deployed Lambdas; they rely on the UTC default.
>
> Had the timestamp columns been created as `timestamptz` (timestamp with time zone), this
> would not happen: Postgres would store and return an exact moment regardless of the api's
> timezone. Switching now is a schema change across the whole project (every entity's
> `created_date` / `updated_date`), so instead keep `TZ` unset in production.

Stop everything with `make docker-down-local`.

### Seeding the database

`make seed-local` loads the sample employees, applicants and jobs from [scripts](scripts/)
into your local database. It is written for an empty database: the records use fixed
identifiers, so running it twice, or running it after you have already logged in, fails on
duplicate keys. To start over, run `make docker-down-local`, delete the `.pgdata` folder
and begin again.

### Logging in

Authentication uses the local Keycloak container, which imports the realm `ien` with nine
test users: `ien_e2e`, `ien_e2e_hmbc`, `ien_e2e_view`, `ien_fha`, `ien_fha2`, `ien_fnha`,
`ien_hmbc`, `ien_moh` and `ien_viha`.

The passwords in [keycloak/realm-ien.json](keycloak/realm-ien.json) are hashed and cannot
be used directly. Instead, `make generate-local-realm` writes
`keycloak/realm-ien.generated.json`, a copy in which every user has the password from
`KEYCLOAK_LOCAL_PASSWORD` in your `.env`. That file is gitignored, so your password is
never committed, and the generator runs automatically as part of `make watch` and
`make docker-run-local`.

Sign in at http://localhost:3000 as **`ien_e2e`** with your `KEYCLOAK_LOCAL_PASSWORD`. That
account has every role in the sample data.

> **Roles come from the database, not from Keycloak**
>
> Keycloak only confirms who you are. What you may do is read from the `employee` table and
> its related role tables. When someone signs in for the first time the api creates a row
> for them with no roles, which is why an unseeded database shows
> "You have logged into IEN, but you have not been assigned a role". Run `make seed-local`
> before your first login.

> **Keycloak keeps no data between runs**
>
> The container stores its realm in memory only. `make stop-local-keycloak` or
> `make docker-down-local` discards it, and the next start re-imports the generated file.
> Passwords or users you add through the admin console are lost; changes to
> `KEYCLOAK_LOCAL_PASSWORD` take effect the same way.

### Connecting the parts

> **API calls from the frontend**
>
> `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`
>
> The frontend reads this at build time to reach the api. It is set for you by the make
> targets and by Docker. If you instead start the frontend directly with `next start` in
> `apps/web`, create a file `apps/web/.env.local` and define it there.

> **Debugging in watch mode**
>
> Set `sourceMap` to `true` in [tsconfig.json](tsconfig.json) and restart the apps to make
> breakpoints work.

> If you get a **DockerException**, make sure Docker Desktop is running.
>
> ```
> docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', ConnectionRefusedError(61, 'Connection refused'))
> ```

### Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `make: yarn: Not a directory` | The yarn shim is missing for the active NodeJS version. Run `corepack enable`. |
| The image build fails on `COPY ${CA_CERTIFICATE_PATH}` | No certificate at `cert/zscaler-root-ca.pem`. See the preparation steps. |
| The image build fails on `cypress ... couldn't be built` | The Cypress download could not be reached. `CYPRESS_INSTALL_BINARY=0` in [Dockerfile.local](Dockerfile.local) prevents this; make sure your image is rebuilt. |
| `EACCES: permission denied, unlink ... .next/...` | Build output left behind as root by an earlier container run. Delete it with `sudo rm -rf apps/web/.next`. |
| The Keycloak user list shows only `admin` | The admin console opens on the `master` realm. Switch to the `ien` realm using **Manage realms**. |
| Signing in shows "you have not been assigned a role" | The database has no roles for you. See "Logging in" above. |

### Legacy container setup

[docker-compose.yml](docker-compose.yml) and [Dockerfile](Dockerfile), used by
`make docker-run`, `make docker-build` and `make docker-down`, are an older stack kept for
reference. They have no Keycloak service and are not used by the pipeline. Prefer the two
options above; these files are expected to be consolidated with the local and test compose
files in the future improvement.

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

Run Cypress integration tests with `make test-e2e`. Run the accessibility suite with `make test-pa11y`.

If you want to open Cypress UI while developing new test cases, run `make run-test-apps` to prepare applications and then run `make open-cypress`.

> **Seed data**
> 
> Login test case should be run to seed a test account and applicants before running any other cases requiring logging in.

> **Cypress session**
> 
> Authentication with Keycloak is a little expensive and time-consuming. To reduce interaction with it, call `cy.login()` before each test case. It creates and stores a session. Subsequent calls restore the session so that it could save time to log in again. When logging in with a user of different role, pass its id as a parameter, then it creates its isolated new session.
> 
> `cy.login('ien_hmbc')`
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

`dev`, `test` and `prod` deployments to AWS are managed through Terraform configurations and GitHub actions. They do not require access to LZ2. However, in order to access LZ2 for updating parameters, troubleshooting, or diagnosing the app, your IDIRs would have to be onboarded on to LZ2 for the project code `uux0vy` -  IEN.

## Authentication
> 
> `local` and `dev` use FreshWorks's Keycloak server at https://keycloak.freshworks.club.
> 
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

To restore the database from a backup, the following steps need to be performed in the specified order

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
