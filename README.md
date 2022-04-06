# Internationally Educated Nurses hiring portal project. 

[![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)]()
The codebase is being roughed out, but finer details are likely to change.

## Front End

### Local API communication

In order to make successful requests from the web application to the APi you'll need to an appropriate value to
the `NEXT_PUBLIC_API_URL` environment variable. This is filled by default when using docker but if you're running
the application on it's own you can supply this value by creating a file named `.env.local` placed in `apps/web`.

ie: 
```
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Tests

Unit and integration tests are run against the API in the CI pipeline on pull request as well as deploy.

### Running Locally

#### API Unit Tests

Run API unit tests with `make api-unit-test`

#### API Integration Tests

Run API integration tests with `make api-integration-test`

This command will spin up a postgres container, run the API integration tests, then close the created container.
