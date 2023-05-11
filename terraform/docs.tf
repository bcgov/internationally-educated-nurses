resource "aws_s3_bucket" "docs" {
  bucket = var.docs_bucket
  acl = "private"
  versioning {
    enabled = true
  }
}
