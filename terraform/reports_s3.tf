resource "aws_s3_bucket" "reports" {
  bucket = var.reports_bucket  
}

resource "aws_s3_bucket_cors_configuration" "reports_cors" {
  bucket = aws_s3_bucket.reports.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://dev.ien.freshworks.club", "https://test.ien.freshworks.club", "https://ien.gov.bc.ca"] // Replace with your frontend domain
    expose_headers  = []
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "all_objects_expiration" {
  bucket = aws_s3_bucket.reports.id

  rule {
    id     = "DeleteAllObjectsAfter1Day"
    status = "Enabled"

    # No prefix means the rule applies to all objects in the bucket
    expiration {
      days = 1
    }
  }
}