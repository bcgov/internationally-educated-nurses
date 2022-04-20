resource "aws_lambda_function" "SyncApplicants" {
  description                    = "Trigger Sync applicant data API"
  function_name                  = "sync-applicants"
  role                           = aws_iam_role.lambda.arn
  runtime                        = "nodejs14.x"
  filename                       = var.sync_applicants_js
  source_code_hash               = filebase64sha256(var.sync_applicants_js)
  handler                        = "index.handler"
  memory_size                    = 2048
  timeout                        = 450
  reserved_concurrent_executions = 1

  vpc_config {
    security_group_ids = [data.aws_security_group.app.id]
    subnet_ids         = data.aws_subnet_ids.app.ids
  }

  environment {
    variables = {}
  }
}


# Scheduler to sync master tables
resource "aws_cloudwatch_event_rule" "hmbc_to_ien_masters" {
  name                = "hmbc_to_ien_masters-daily"
  description         = "7:00AM UTC - 12:00AM PST"
  schedule_expression = "cron(0 7 * * ? *)"
}
resource "aws_cloudwatch_event_target" "hmbc_to_ien_masters" {
  rule  = aws_cloudwatch_event_rule.hmbc_to_ien_masters.name
  arn   = aws_lambda_function.SyncApplicants.arn
  input = "{\"hostname\": \"${aws_cloudfront_distribution.app.domain_name}\",\"path\": \"/api/v1/external-api/save\"}"
}

resource "aws_lambda_permission" "hmbc_to_ien_masters" {
  statement_id  = "AllowExecutionFromCloudWatch_Morning"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.SyncApplicants.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.hmbc_to_ien_masters.arn
}


# Scheduler to sync applicant and applicant-milestones
resource "aws_cloudwatch_event_rule" "hmbc_to_ien_applicants" {
  name                = "hmbc_to_ien_applicants-daily"
  description         = "8:00AM UTC - 1:00AM PST"
  schedule_expression = "cron(0 8 * * ? *)"
}
resource "aws_cloudwatch_event_target" "hmbc_to_ien_applicants" {
  rule  = aws_cloudwatch_event_rule.hmbc_to_ien_applicants.name
  arn   = aws_lambda_function.SyncApplicants.arn
  input = "{\"hostname\": \"${aws_cloudfront_distribution.app.domain_name}\",\"path\": \"/api/v1/external-api/save-applicant\"}"
}

resource "aws_lambda_permission" "hmbc_to_ien_applicants" {
  statement_id  = "AllowExecutionFromCloudWatch_Morning"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.SyncApplicants.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.hmbc_to_ien_applicants.arn
}
