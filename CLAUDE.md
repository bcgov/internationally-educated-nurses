# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Internationally Educated Nurses (IEN) portal is a BC Government application managing the hiring process for internationally educated nurses. It's a monorepo with separate frontend/backend applications deployed on AWS.

## Architecture

**Monorepo Structure (Yarn Workspaces):**
- `apps/api/` - NestJS backend API with TypeORM and PostgreSQL
- `apps/web/` - Next.js frontend with static export and Tailwind CSS
- `packages/common/` - Shared TypeScript library (DTOs, interfaces, constants)
- `packages/accessibility/` - pa11y accessibility testing suite

**Technology Stack:**
- Backend: NestJS, TypeORM, PostgreSQL, Keycloak auth, Swagger docs
- Frontend: Next.js 14, React 18, Tailwind CSS, Formik, SWR
- Database: PostgreSQL with TypeORM migrations (never use synchronization)
- Authentication: Keycloak OIDC with different servers per environment
- Deployment: AWS Lambda, S3, CloudFront via Terraform

## Development Commands

**Local Development:**
```bash
# Start with Docker (recommended)
make docker-run

# Start as Node processes (requires Docker DB)
make start-local        # Production-like mode
make watch             # Development with hot reload
make start-local-db    # Database only
```

**Testing:**
```bash
# Unit tests
make api-unit-test
make web-unit-test

# Integration tests
make api-integration-test
make test-e2e          # Cypress E2E tests
make test-pa11y        # Accessibility compliance

# Test environment setup
make run-test-apps     # Start apps with test data
make open-cypress      # Open Cypress UI for development
```

**Build & Deploy:**
```bash
# Build components
make build-api
make build-web
make build-common

# Deploy to environments
make tag-dev           # Deploy to dev
make tag-test          # Deploy to test
make tag-prod version=v1.2.3  # Deploy to production
```

**Database Operations:**
```bash
# TypeORM migrations (in Docker container)
make migration-generate name=AddNewField
make migration-revert

# Database tunneling for remote access
make open-db-tunnel ENV_NAME=dev
```

## Key Development Notes

**Environment Configuration:**
- Copy `.config/.env.example` to `.env` and configure database variables
- Four environments: local, dev, test, prod
- Different Keycloak servers: FreshWorks (local/dev) vs Ministry of Health (test/prod)

**Database Requirements:**
- Always use TypeORM migrations, never synchronization
- Ephemeral test database recreated for each test run
- Custom naming strategy in place

**Authentication:**
- Keycloak OIDC integration with role-based access control
- Cypress tests use session caching to avoid repeated logins
- Test users require same password across environments

**Code Style:**
- TypeScript across entire stack
- Shared types and interfaces in `packages/common`
- Follow existing patterns for components and API endpoints
- ESLint + Prettier formatting enforced

**Testing Strategy:**
- Unit tests with Jest for both frontend and backend
- Integration tests with ephemeral test database
- E2E tests with Cypress and fixture data
- Accessibility tests with pa11y (must pass for deployment)
- Security scanning with ZAP

**AWS Deployment:**
- Infrastructure managed by Terraform with Terraform Cloud backend
- API deployed as Lambda functions (6 different Lambda functions)
- Frontend as static S3 site with CloudFront CDN
- Database backups created on every deployment
- Multiple Lambda functions: api, syncdata, notifylambda, cache-reports, s3-upload-reports, end-of-journey-lambda

**Important Constraints:**
- Never commit directly to main - use pull requests
- All deployments are tag-based via GitHub Actions
- Database migrations run automatically on deployment
- Static export for Next.js (no server-side rendering)
- LZ2 AWS project code: `uux0vy`