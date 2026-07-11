# terraform {
#   backend "s3" {
#     bucket         = "orion-lms-terraform-state"
#     key            = "global/s3/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "orion-lms-tflocks"
#     encrypt        = true
#   }
# }