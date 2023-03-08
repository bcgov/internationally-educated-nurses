resource "aws_lambda_function" "CacheReportFour" {
  description      = "Trigger Caching of Report 4"
  function_name    = local.cache_report_four_lambda_name
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs14.x"
  filename         = "./build/empty_lambda.zip"
  source_code_hash = filebase64sha256("./build/empty_lambda.zip")
  handler          = "api/cachereportfour.handler"
  memory_size      = var.function_memory_mb
  timeout          = 300

  vpc_config {
    security_group_ids = [data.aws_security_group.app.id]
    subnet_ids         = data.aws_subnet_ids.app.ids
  }

  lifecycle {
    ignore_changes = [
      # Ignore changes to tags, e.g. because a management agent
      # updates these based on some ruleset managed elsewhere.
      filename,
      source_code_hash,
      source_code_size,
      last_modified,
    ]
  }

  environment {
    variables = {
      NODE_ENV          = "production"
      RUNTIME_ENV       = "hosted"
      AUTH_URL          = data.aws_ssm_parameter.keycloak_url.value
      AUTH_REALM        = data.aws_ssm_parameter.keycloak_realm.value
      TARGET_ENV        = var.target_env
      AWS_S3_REGION     = var.region
      BUILD_ID          = var.build_id
      BUILD_INFO        = var.build_info
      POSTGRES_USERNAME = var.db_username
      POSTGRES_PASSWORD = data.aws_ssm_parameter.postgres_password.value
      POSTGRES_HOST     = aws_rds_cluster.pgsql.endpoint
      POSTGRES_DATABASE = aws_rds_cluster.pgsql.database_name
    }
  }
}

resource "aws_cloudwatch_event_rule" "cache_report_four" {
  name                = local.cache_report_four_lambda_name
  description         = "7:00AM UTC - 12:00AM PST Every day"
  schedule_expression = "cron(0 7 * * ? *)"
}

resource "aws_cloudwatch_event_target" "cache_report_four" {
  rule  = aws_cloudwatch_event_rule.cache_report_four.name
  arn   = aws_lambda_function.CacheReportFour.arn
  input = "{\"path\": \"cache-report-four\"}"
}

resource "aws_lambda_permission" "cache_report_four" {
  statement_id  = "AllowExecutionFromCloudWatch_Morning"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.CacheReportFour.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.cache_report_four.arn
}