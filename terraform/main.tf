terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.10.0"
    }
  }
  backend "s3" {
    encrypt = true   
  }
}

provider "aws" {
  region = var.region
}

# Cloudfront Functions and ACM certificate resources
provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

locals {
  namespace = "${var.project_code}-${var.target_env}"
  app_name  = "${local.namespace}-app"
  api_name  = "${local.namespace}-api"
  syncdata_lambda_name  = "${local.namespace}-syncdata"
  sync_master_data_scheduler  = "${local.namespace}-hmbc-to-ien-masters"
  sync_applicant_data_scheduler  = "${local.namespace}-hmbc-to-ien-applicants"
  notify_lambda_name  = "${local.namespace}-notifylambda"
  cache_reports_lambda_name  = "${local.namespace}-cache-reports"
  report_s3_upload_lambda_name  = "${local.namespace}-s3-upload-reports"
  db_name = "${local.namespace}-db"
  end_of_journey_lambda_name  = "${local.namespace}-end-of-journey-lambda"
  end_of_journey_scheduler = "${local.namespace}-end-of-journey-scheduler"

  has_domain = var.domain != ""
  is_prod = var.domain == "ien.gov.bc.ca"
}
