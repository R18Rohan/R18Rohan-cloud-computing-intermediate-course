#########################################################
# Input Variables
#########################################################

variable "aws_region" {

  description = "AWS Region"

  type = string

  default = "us-east-1"

}

variable "vpc_a_cidr" {

  description = "CIDR Block for VPC A"

  type = string

  default = "10.0.0.0/16"

}

variable "vpc_b_cidr" {

  description = "CIDR Block for VPC B"

  type = string

  default = "10.1.0.0/16"

}