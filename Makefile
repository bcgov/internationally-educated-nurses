# Internationally Educated Nurses 
# Default Environments
-include ./.env

export $(shell sed 's/=.*//' ./.env)

# Project
export PROJECT := ien

# Runtime and application Environments specific variable
export ENV_NAME ?= local
export POSTGRES_USERNAME ?= freshworks
export CHES_CLIENT_ID ?= IEN_SERVICE_CLIENT

# Integration testing variables
export TEST_POSTGRES_HOST ?= localhost
export TEST_POSTGRES_USERNAME ?= freshworks
export TEST_POSTGRES_PASSWORD ?= password
export TEST_POSTGRES_DATABASE ?= ien_test
export TEST_POSTGRES_PORT ?= 5433

# Git
export COMMIT_SHA:=$(shell git rev-parse --short=7 HEAD)
export LAST_COMMIT_MESSAGE:=$(shell git log -1 --oneline --decorate=full --no-color --format="%h, %cn, %f, %D" | sed 's/->/:/')

# TF Token. Guarded so that developers without terraform credentials do not see a
# 'No such file' error printed before every unrelated make target.
export TFCTK = $(shell test -f ~/.terraform.d/credentials.tfrc.json && jq -r '.credentials."app.terraform.io".token' ~/.terraform.d/credentials.tfrc.json)

# FE Env Vars
export NEXT_PUBLIC_API_URL ?= /api/v1
export NEXT_PUBLIC_AUTH_REALM ?= moh_applications
export NEXT_PUBLIC_AUTH_CLIENTID ?= IEN

# BE Env Vars
export AUTH_URL:=$(AUTH_URL)
export AUTH_REALM:=$(AUTH_REALM)

# Docker container names
LOCAL_API_CONTAINER_NAME = $(PROJECT)_api

# AWS Environments variables
export AWS_REGION ?= ca-central-1
NAMESPACE = $(PROJECT)-$(ENV_NAME)
APP_SRC_BUCKET = $(NAMESPACE)-app
API_SRC_BUCKET = $(NAMESPACE)-api
DOCS_BUCKET = $(NAMESPACE)-docs
REPORTS_BUCKET = $(NAMESPACE)-reports

# Terraform variables
TERRAFORM_DIR = terraform
export BOOTSTRAP_ENV=terraform/bootstrap

export KC_ADMIN=kcadmin
export KC_ADMIN_PASSWORD=password

ifeq ($(ENV_NAME), prod)
export DOMAIN=ien.gov.bc.ca
export NEXT_PUBLIC_AUTH_URL=https://common-logon.hlth.gov.bc.ca/auth
export BASTION_INSTANCE_ID = $(BASTION_INSTANCE_ID_PROD)
export DB_HOST = $(DB_HOST_PROD)
export BASTION_INSTANCE_ID = $(BASTION_INSTANCE_ID_PROD)
endif

ifeq ($(ENV_NAME), dev) 
export DOMAIN=dev.ien.gov.bc.ca
export NEXT_PUBLIC_AUTH_URL=https://common-logon-dev.hlth.gov.bc.ca/auth
export BASTION_INSTANCE_ID=$(BASTION_INSTANCE_ID_DEV)
export DB_HOST=$(DB_HOST_DEV)
endif

ifeq ($(ENV_NAME), test) 
export DOMAIN=test.ien.gov.bc.ca
export NEXT_PUBLIC_AUTH_URL=https://common-logon-test.hlth.gov.bc.ca/auth
export BASTION_INSTANCE_ID=$(BASTION_INSTANCE_ID_TEST)
export DB_HOST=$(DB_HOST_TEST)
endif

ifeq ($(ENV_NAME), local) 
export DOMAIN=localhost
export NEXT_PUBLIC_AUTH_URL=http://localhost:8080/
export BASTION_INSTANCE_ID=$(BASTION_INSTANCE_ID_TEST)
export DB_HOST=$(DB_HOST_TEST)
endif

export MAIL_FROM = IENDoNotReply@$(DOMAIN)

define TFVARS_DATA
target_env = "$(ENV_NAME)"
project_code = "$(PROJECT)"
api_artifact = "build/api.zip"
app_sources = "build/app"
app_sources_bucket = "$(APP_SRC_BUCKET)"
api_sources_bucket = "$(API_SRC_BUCKET)"
docs_bucket = "$(DOCS_BUCKET)"
reports_bucket = "$(REPORTS_BUCKET)"
domain = "$(DOMAIN)"
db_username = "$(POSTGRES_USERNAME)"
ches_client_id = "$(CHES_CLIENT_ID)"
mail_from = "$(MAIL_FROM)"
build_id = "$(COMMIT_SHA)"
build_info = "$(LAST_COMMIT_MESSAGE)"
target_aws_account_id = "${AWS_ACCOUNT_ID}"
endef
export TFVARS_DATA

# Terraform cloud backend config variables
# LZ2 
LZ2_PROJECT = uux0vy

# Terraform Cloud backend config variables
define TF_BACKEND_CFG
bucket = "terraform-remote-state-${LZ2_PROJECT}-${ENV_NAME}"
key = ".terraform/terraform.tfstate"
dynamodb_table ="terraform-remote-state-lock-${LZ2_PROJECT}"
endef
export TF_BACKEND_CFG


.PHONY: help print-env bootstrap bootstrap-terraform \
	watch start-local start-local-db stop-local-db \
	generate-local-realm start-local-keycloak stop-local-keycloak \
	docker-build-local docker-run-local docker-down-local seed-local \
	start-test-env stop-test-env start-test-db stop-test-db \
	start-test-keycloak stop-test-keycloak

# Default target: list the documented recipes.
help:
	@echo "\nIEN make targets. Run 'make <target>'.\n"
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2}'
	@echo "\nSee README.md for the full local setup.\n"


# ===================================
# Aliases 
# ===================================

bootstrap-terraform: print-env bootstrap
build-terraform-artifact: clean-yarn print-env pre-build build-api

# ===================================
# Local Development
# ===================================

build-artifact-local: build-terraform-artifact
	@yarn
clean-yarn: 
	@rm -rf node_modules
	@yarn
print-env:
	@echo "\n**** ENVIRONMENTS ****\n"
	@echo "\nProject: $(PROJECT)"
	@echo "\nNODE_ENV: $(NODE_ENV)"
	@echo "\nNAMESPACE=$(NAMESPACE)"
	@echo
	@echo ./$(TERRAFORM_DIR)/.auto.tfvars:
	@echo "$$TFVARS_DATA"
	@echo
	@echo ./$(TERRAFORM_DIR)/backend.hcl:
	@echo "$$TF_BACKEND_CFG"
	@echo "\n*********************\n"

# --- Running the app: api and web on the host, database and Keycloak in Docker ---

watch: print-env start-local-db start-local-keycloak ## Database and Keycloak in Docker, api and web on the host with hot reload
	@echo "++\n***** Running api + web in local Node server\n++"
	@yarn
	@yarn watch

start-local: print-env start-local-db start-local-keycloak ## Same as watch, but without hot reload
	@echo "++\n***** Running api + web in local Node server\n++"
	@yarn 
	@yarn start:local

# --- Individual local containers ---

start-local-db: ## Start only the database container
	@echo "++\n***** Starting local database\n++"
	@docker compose --file docker-compose.local.yml up -d db 
	@echo "++\n*****"

stop-local-db: ## Stop the database container
	@echo "++\n***** Stopping local database\n++"
	@docker compose --file docker-compose.local.yml down db
	@echo "++\n*****"

generate-local-realm: ## Write keycloak/realm-ien.generated.json using KEYCLOAK_LOCAL_PASSWORD
	@echo "++\n***** Generating local Keycloak realm\n++"
	@node scripts/generate-local-realm.js
	@echo "++\n*****"

start-local-keycloak: generate-local-realm ## Start only the Keycloak container
	@echo "++\n***** Starting local Keycloak\n++"
	@docker compose --file docker-compose.local.yml up -d keycloak
	@echo "++\n*****"

stop-local-keycloak: ## Stop and remove the Keycloak container
	@echo "++\n***** Stopping local Keycloak\n++"
	@docker compose --file docker-compose.local.yml down keycloak
	@echo "++\n*****"

# --- Running the app: every service in Docker ---

docker-down-local: ## Stop and remove all local containers
	@echo "++\n***** Stopping local Docker containers\n++"
	@docker compose --file docker-compose.local.yml down
	@echo "++\n*****"

docker-down:
	@echo "++\n***** Stopping Docker containers\n++"
	@docker compose down
	@echo "++\n*****"

docker-build-local: ## Build the local container images
	@echo "++\n*****  Running local docker compose\n++"
	@yarn
	@docker compose --file docker-compose.local.yml build
	@echo "++\n*****"

docker-build:
	@echo "++\n***** Running docker compose\n++"
	@docker compose build
	@echo "++\n*****"

docker-run-local: docker-build-local generate-local-realm ## Build and run every service in Docker
	@echo "++\n***** Running local docker compose\n++"
	@docker compose --file docker-compose.local.yml up
	@echo "++\n*****"

docker-run:
	@echo "++\n***** Running docker compose\n++"
	@yarn
	@docker compose up --build
	@echo "++\n*****"

api-unit-test: ## Run api unit tests
	@echo "++\n***** Running API unit tests\n++"
	@yarn workspace @ien/api build
	@yarn workspace @ien/api test
	@echo "++\n*****"

web-unit-test: ## Run web unit tests
	@echo "++\n***** Running WEB unit tests\n++"
	@yarn workspace @ien/web test
	@echo "++\n*****"

start-test-env: ## Start the test database and test Keycloak
	@docker compose -f docker-compose.test.yaml up --build -d

stop-test-env: ## Stop the test stack
	@docker compose -f docker-compose.test.yaml down

start-test-db:
	@docker compose -f docker-compose.test.yaml up --build -d test-db

stop-test-db:
	@docker compose -f docker-compose.test.yaml down test-db

start-test-keycloak: ## Start only the Keycloak container of the test stack
	docker compose -f ./docker-compose.test.yaml up -d keycloak

stop-test-keycloak: ## Stop the Keycloak container of the test stack
	docker compose -f ./docker-compose.test.yaml down keycloak

format:
	@yarn format:write

api-integration-test: ## Run api integration tests against the test database
	@make start-test-db
	@echo "++\n***** Running API integration tests\n++"
	@yarn workspace @ien/api build
	@NODE_ENV=test yarn workspace @ien/api test:e2e
	@echo "++\n*****"
	@make stop-test-db

run-seed:
	@make start-test-env
	@scripts/seed-test-data.sh	
	@echo "++\n*****"

# Seeds the local dev database (5432) with the same fixtures the test stack uses.
# Runs psql inside the db container so no postgres client is needed on the host, and
# leaves scripts/seed-test-data.sh (which CI calls against the test db) untouched.
# The data uses fixed ids, so run it on a fresh database - before logging in, since
# the first login auto-creates an employee row that collides with the seed.
seed-local: ## Load the sample employees, applicants and jobs into the local database
	@echo "++\n***** Seeding local database\n++"
	@echo "waiting for the api to finish its migrations"
	@for i in $$(seq 1 120); do \
		curl -sf --noproxy '*' http://localhost:4000/api/v1/version > /dev/null && break; \
		if [ $$i -eq 120 ]; then echo "\n[ERROR] api is not responding on port 4000"; exit 1; fi; \
		printf "."; sleep 1; \
	done
	@echo ""
	@for file in data-employees data-applicants data-jobs data-milestones; do \
		echo "  $$file"; \
		docker exec -i $(PROJECT)_db psql -q -v ON_ERROR_STOP=1 \
			-U $(POSTGRES_USERNAME) -d $(POSTGRES_DATABASE) < scripts/$$file.sql > /dev/null || exit 1; \
	done
	@echo "++\n*****"

run-test-apps:
	@make start-test-env
	@scripts/seed-test-data.sh &
	NODE_ENV=test yarn watch
	@echo "++\n*****"

test-e2e: ## Run the Cypress end to end suite
	@make start-test-env
	@echo "++\n***** Running Web integration tests\n++"
	@yarn build
	@NODE_ENV=test yarn test:e2e
	@make stop-test-db
	@echo "++\n*****"

cypress:
	@yarn workspace @ien/web cypress

open-cypress: ## Open the Cypress interactive runner
	@yarn workspace @ien/web open:cypress

test-pa11y: ## Run the accessibility suite
	@make start-test-env
	@yarn build
	@echo "++\n***** Running front end accessibility tests\n++"
	@NODE_ENV=test yarn test:pa11y
	@make stop-test-db
	@echo "++\n*****"

debug-pa11y:
	@echo "++\n***** Running front end accessibility tests\n++"
	@yarn workspace @ien/accessibility debug
	@echo "++\n*****"

generate-accessibility-results:
	@echo "++\n***** Generating Github Comment from Test Results\n++"
	@yarn workspace @ien/accessibility generate-accessibility-results
	@echo "++\n*****"

sync-master:
	@yarn workspace @ien/api syncdata master

sync-applicant:
	@yarn workspace @ien/api syncdata applicant
# ===================================
# Build application stack
# ===================================

pre-build:
	@echo "++\n***** Pre-build Clean Build Artifact\n++"
	@rm -rf ./terraform/build || true
	@mkdir -p ./terraform/build
	@echo "++\n*****"

build-api:
	@echo "++\n***** Building API for AWS\n++"
	@echo 'Building api package... \n' 
	@yarn workspace @ien/api build
	@echo 'Updating prod dependencies...\n'
	@yarn workspaces focus @ien/api --production
	@echo 'Deleting existing build dir...\n'
	@rm -rf ./.build || true
	@echo 'Creating build dir...\n'
	@mkdir -p .build/api
	@echo 'Copy Node modules....\n' && cp -r node_modules .build/api
	@echo 'Unlink local packages...\n' && rm -rf .build/api/node_modules/@ien/*
	@echo 'Hardlink local packages...\n' 
	@cp -r ./packages/* .build/api/node_modules/@ien/
	@echo 'Copy api ...\n' && cp -r apps/api/dist/* .build/api
	@echo 'Copy api/ormconfig ...\n' && cp -r apps/api/dist/ormconfig.js .build/api
	@echo 'Creating Zip ...\n' && cd .build && zip -r api.zip ./api && cd ..
	@echo 'Copying to terraform build location...\n'
	@cp ./.build/api.zip ./terraform/build/api.zip
	@echo 'Done!\n'
	@echo "++\n****"

build-web:
	@echo "++\n***** Building Web for AWS\n++"
	@yarn workspace @ien/web build
	@mv ./apps/web/out ./terraform/build/app
	@echo "++\n*****"

build-common:
	@echo "++\n***** Building Common\n++"
	@yarn workspace @ien/common build
	@echo "++\n*****"
# ===================================
# Terraform commands
# ===================================

write-config-tf:
	@echo "$$TFVARS_DATA" > $(TERRAFORM_DIR)/.auto.tfvars
	@echo "$$TF_BACKEND_CFG" > $(TERRAFORM_DIR)/backend.hcl

init: write-config-tf
	# Initializing the terraform environment
	@terraform -chdir=$(TERRAFORM_DIR) init -input=false \
		-reconfigure \
		-backend-config=backend.hcl \
		-upgrade

plan: init
	# Creating all AWS infrastructure.
	@terraform -chdir=$(TERRAFORM_DIR) plan -no-color

apply: init 
	# Creating all AWS infrastructure.
	@terraform -chdir=$(TERRAFORM_DIR) apply -auto-approve -input=false

destroy: init
	@terraform -chdir=$(TERRAFORM_DIR) destroy

runs: 
	./terraform/scripts/runs.sh $(TFCTK) $(ENV_NAME)

# ===================================
# AWS Deployments
# ===================================

sync-app:
	aws s3 sync ./terraform/build/app s3://$(APP_SRC_BUCKET) --delete

upload-api-zip:
	aws s3 cp ./terraform/build/api.zip s3://$(API_SRC_BUCKET)/api-lambda-s3 --region $(AWS_REGION)

deploy-app:
	aws --region $(AWS_REGION) cloudfront create-invalidation --distribution-id $(CLOUDFRONT_ID) --paths "/*"

# Full redirection to /dev/null is required to not leak env variables
deploy-api:
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-api --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-syncdata --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-notifylambda --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-cache-reports --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-s3-upload-reports --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null
	aws lambda update-function-code --function-name ien-$(ENV_NAME)-end-of-journey-lambda --s3-bucket $(API_SRC_BUCKET) --s3-key "api-lambda-s3" --region $(AWS_REGION) > /dev/null

deploy-all: sync-app upload-api-zip deploy-api
	@echo "Deploying Webapp and API"

backup-db:
	@echo "Creating a database snapshot"
	aws rds create-db-cluster-snapshot --db-cluster-identifier ien-$(ENV_NAME)-db --db-cluster-snapshot-identifier  ien-$(ENV_NAME)-db-snapshot-$(COMMIT_SHA)

# ===================================
# Tag Based Deployments
# ===================================

pre-tag:
	@./scripts/check_rebase.sh
	
tag-dev:
	@git tag -fa dev -m "Deploy dev: $(git rev-parse --abbrev-ref HEAD)"
	@git push --force origin refs/tags/dev:refs/tags/dev

tag-test:
	@git tag -fa test -m "Deploy test: $(git rev-parse --abbrev-ref HEAD)"
	@git push --force origin refs/tags/test:refs/tags/test

tag-prod:
ifndef version
	@echo "++\n***** ERROR: version not set.\n++"
	@exit 1
else
	@git tag -fa $(version) -m "IEN release version: $(version)"
	@git push --force origin refs/tags/$(version):refs/tags/$(version)
	@git tag -fa prod -m "Deploy prod: $(version)"
	@git push --force origin refs/tags/prod:refs/tags/prod
endif

tag-sec:
	@git tag -fa security -m "security scans: $(git rev-parse --abbrev-ref HEAD)"
	@git push --force origin refs/tags/security:refs/tags/security

# Typeorm Migrations

migration-generate:
	@docker exec $(LOCAL_API_CONTAINER_NAME) yarn workspace @ien/api typeorm migration:generate -n $(name)

migration-revert:
	@docker exec $(LOCAL_API_CONTAINER_NAME) yarn workspace @ien/api typeorm migration:revert


# ===================================
# DB Tunneling
# ===================================

open-db-tunnel:
	# Needs exported credentials for a matching LZ2 space
	@echo "Running for ENV_NAME=$(ENV_NAME)\n"
	@echo "Host Instance Id: $(BASTION_INSTANCE_ID) | $(BASTION_INSTANCE_ID_DEV) | $(DOMAIN)\n"
	@echo "DB HOST URL: $(DB_HOST)\n"
	# Checking you have the SSM plugin for the AWS cli installed
	session-manager-plugin
	@echo "Starting port forwarding session..."
	aws ssm start-session --target $(BASTION_INSTANCE_ID) --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters "{\"host\":[\"$(DB_HOST)\"],\"portNumber\":[\"5432\"],\"localPortNumber\":[\"5454\"]}"
