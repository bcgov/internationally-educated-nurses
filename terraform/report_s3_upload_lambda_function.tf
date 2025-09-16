resource "aws_lambda_function" "UploadReports" {
  description      = "Trigger uploading of Reports"
  function_name    = local.report_s3_upload_lambda_name
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs22.x"
  filename         = "./build/empty_lambda.zip"
  source_code_hash = filebase64sha256("./build/empty_lambda.zip")
  handler          = "api/uploadreports.handler"
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
      REPORTS_BUCKET    = var.reports_bucket
      NO_COLOR          = "true"      
    }
  }
}

resource "aws_lambda_permission" "allow_invoke_by_lambda" {
  statement_id  = "AllowInvokeByAnotherLambda"  # Unique ID for the permission
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.UploadReports.function_name
  principal     = "lambda.amazonaws.com"  # This specifies that the invoking service is Lambda  
  # ARN of the role of the Lambda that will invoke this function
  source_arn    = aws_lambda_function.api.arn  # Adjust this with the correct resource
}
