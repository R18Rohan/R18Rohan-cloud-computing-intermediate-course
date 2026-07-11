# Terraform Configuration: Topic 4 - Advanced Serverless & Event-Driven Architecture

provider "aws" {
  region = "us-east-1"
}

# 1. Amazon SQS Dead Letter Queue (DLQ)
resource "aws_sqs_queue" "app_events_dlq" {
  name                      = "application-events-dlq"
  message_retention_seconds = 1209600 # 14 days
}

# 2. Amazon SQS Main Queue with Redrive Policy
resource "aws_sqs_queue" "app_events_queue" {
  name                      = "application-events-queue"
  visibility_timeout_seconds = 300 # 5 minutes

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.app_events_dlq.arn
    maxReceiveCount     = 5
  })
}

# 3. Amazon SNS Topic (Fan-out)
resource "aws_sns_topic" "app_sns_topic" {
  name = "application-events-topic"
}

# SNS Subscription with message filtering
resource "aws_sns_topic_subscription" "queue_sub" {
  topic_arn = aws_sns_topic.app_sns_topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.app_events_queue.arn

  filter_policy = jsonencode({
    event_type = ["payment_processed", "user_signup"]
  })
}

# 4. Amazon EventBridge Custom Event Bus & Rule Targets
resource "aws_cloudwatch_event_bus" "custom_bus" {
  name = "production-custom-event-bus"
}

resource "aws_cloudwatch_event_rule" "payment_rule" {
  name           = "route-payment-events"
  event_bus_name = aws_cloudwatch_event_bus.custom_bus.name
  description    = "Routes payment event notifications to the SNS topic"

  event_pattern = jsonencode({
    source      = ["custom.payment.service"]
    detail-type = ["PaymentTransactionState"]
  })
}

resource "aws_cloudwatch_event_target" "sns_target" {
  rule           = aws_cloudwatch_event_rule.payment_rule.name
  event_bus_name = aws_cloudwatch_event_bus.custom_bus.name
  arn            = aws_sns_topic.app_sns_topic.arn
}
