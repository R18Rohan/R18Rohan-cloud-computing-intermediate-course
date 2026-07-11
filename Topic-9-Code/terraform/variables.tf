variable "aws_region" {

  type    = string
  default = "ap-southeast-1"

}

variable "vpc_id" {

  type = string

}

variable "public_subnet_1" {

  type = string

}

variable "public_subnet_2" {

  type = string

}

variable "db_username" {

  type = string

}

variable "db_password" {

  type      = string
  sensitive = true

}