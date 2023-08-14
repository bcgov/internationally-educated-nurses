resource "aws_ses_domain_identity" "ses_domain" {
  domain = var.domain
}

resource "aws_ses_domain_mail_from" "mail_from" {
  domain           = aws_ses_domain_identity.ses_domain.domain
  mail_from_domain = "mail.${var.domain}"
}

resource "aws_ses_domain_dkim" "dkim" {
  domain = aws_ses_domain_identity.ses_domain.domain
}
