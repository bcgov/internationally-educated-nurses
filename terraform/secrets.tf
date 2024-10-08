# These should be manually populated in the console for each environment

data "aws_ssm_parameter" "hmbc_ats_base_url" {
  name = "/${var.project_code}/${var.target_env}/hmbc/ats/base-url"
}

data "aws_ssm_parameter" "sync_jwt_secret" {
  name = "/${var.project_code}/${var.target_env}/hmbc/ats/jwt_secret"
}

data "aws_ssm_parameter" "hmbc_ats_auth_key" {
  name = "/${var.project_code}/${var.target_env}/hmbc/ats/auth-key"
}

data "aws_ssm_parameter" "postgres_password" {
  name = "/${var.project_code}/${var.target_env}/postgres/password"
}


data "aws_ssm_parameter" "keycloak_url" {
  name = "/${var.project_code}/${var.target_env}/keycloak_url"
}

data "aws_ssm_parameter" "keycloak_realm" {
  name = "/${var.project_code}/${var.target_env}/keycloak_realm"
}

data "aws_ssm_parameter" "teams_alerts_webhook_url" {
  name = "/${var.project_code}/${var.target_env}/teams/alerts_webhook_url"
}

data "aws_ssm_parameter" "mail_recipients" {
  name = "/${var.project_code}/${var.target_env}/mail_recipients"
}
# data "aws_ssm_parameter" "ches_client_secret" {
#   name = "/${var.project_code}/${var.target_env}/ches/client_secret"
# }


# data "aws_ssm_parameter" "ches_service_host" {
#   name = "/${var.project_code}/${var.target_env}/ches/host"
# }


# data "aws_ssm_parameter" "ches_auth_url" {
#   name = "/${var.project_code}/${var.target_env}/ches/auth_url"
# }

resource "aws_ssm_parameter" "feature_flag_can_ha_access_report" {
  name  = "/${var.project_code}/${var.target_env}/feature_flags/can_ha_access_report"
  type  = "String"
  value = "false"

  lifecycle {
    ignore_changes = [
      value, # Ignore changes to the value of the parameter
    ]
  }
}
