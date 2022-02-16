# These should be manually populated in the console for each environment

data "aws_ssm_parameter" "postgres_password" {
  name = "/${var.project_code}/${var.target_env}/postgres/password"
}


data "aws_ssm_parameter" "ches_client_secret" {
  name = "/${var.project_code}/${var.target_env}/ches/client_secret"
}


data "aws_ssm_parameter" "ches_service_host" {
  name = "/${var.project_code}/${var.target_env}/ches/host"
}


data "aws_ssm_parameter" "ches_auth_url" {
  name = "/${var.project_code}/${var.target_env}/ches/auth_url"
}

data "aws_ssm_parameter" "slack_alerts_webhook_url" {
  name = "/${var.project_code}/${var.target_env}/slack/alerts_webhook_url"
}
