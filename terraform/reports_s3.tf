resource "aws_s3_bucket" "reports" {
  bucket = var.reports_bucket  
}

resource "aws_s3_bucket_cors_configuration" "reports_cors" {
  bucket = aws_s3_bucket.reports.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"] // Replace with your frontend domain
    expose_headers  = []
  }
}