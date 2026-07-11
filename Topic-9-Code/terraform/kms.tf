##############################################################
# Customer Managed KMS Key
##############################################################

resource "aws_kms_key" "rds_kms" {

  description = "Topic 9 KMS Key"

  deletion_window_in_days = 7

  enable_key_rotation = true

  tags = {

    Name = "Topic9-KMS-Key"

  }

}