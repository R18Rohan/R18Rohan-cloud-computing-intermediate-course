# Terraform Configurations: Topic 6 - Advanced AWS Security

provider "aws" {
  region = "us-east-1"
}

# 1. AWS Key Management Service (KMS) Customer Managed Key (CMK)
resource "aws_kms_key" "app_encryption_key" {
  description             = "KMS Key for application storage encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true # Hardening: Automatic Key Rotation
}

# 2. AWS Secrets Manager Secret
resource "aws_secretsmanager_secret" "database_credentials" {
  name       = "production-database-credentials"
  kms_key_id = aws_kms_key.app_encryption_key.key_id
}



# 3. AWS WAFv2 Web ACL (SQL Injection defense rules)
resource "aws_wafv2_web_acl" "web_firewall" {
  name        = "production-web-acl"
  description = "WAF Web ACL to mitigate common SQL injection attacks"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "SQLiMitigationRule"
    priority = 1

    action {
      block {}
    }

    statement {
      sqli_match_statement {
        field_to_match {
          query_string {}
        }
        text_transformation {
          priority = 1
          type     = "URL_DECODE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "SQLiMitigationRuleMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "WebACLMetric"
    sampled_requests_enabled   = true
  }
}
