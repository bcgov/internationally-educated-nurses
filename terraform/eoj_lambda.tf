resource "aws_lambda_function" "EndOfJourney" {
  description      = "Trigger end of journey service"
  function_name    = local.end_of_journey_lambda_name
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs18.x"
  filename         = "./build/empty_lambda.zip"
  source_code_hash = filebase64sha256("./build/empty_lambda.zip")
  handler          = "api/endofjourney.handler"
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
      HMBC_ATS_BASE_URL = data.aws_ssm_parameter.hmbc_ats_base_url.value
      HMBC_ATS_AUTH_KEY = data.aws_ssm_parameter.hmbc_ats_auth_key.value
      JWT_SECRET        = data.aws_ssm_parameter.sync_jwt_secret.value
      MAIL_FROM         = var.mail_from
      MAIL_RECIPIENTS   = data.aws_ssm_parameter.mail_recipients.value
      SQS_QUEUE_URL     = aws_sqs_queue.terraform_queue.url
      NO_COLOR          = "true"
    }
  }
}


#Scheduler to end of journey
resource "aws_cloudwatch_event_rule" "end_of_journey" {
  name                = local.end_of_journey_scheduler
  description         = "1:00 AM or 2:00 AM PST (9:00AM UTC) every day"
  schedule_expression = "cron(0 9 * * ? *)" # 9:00AM UTC every day
}

resource "aws_cloudwatch_event_target" "end_of_journey" {
  rule  = aws_cloudwatch_event_rule.end_of_journey.name
  arn   = aws_lambda_function.EndOfJourney.arn
  input = "{\"path\": \"end-of-journey-complete\"}"
}

resource "aws_lambda_permission" "end_of_journey" {
  statement_id  = "AllowExecutionFromCloudWatch_Morning"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.EndOfJourney.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.end_of_journey.arn
}

