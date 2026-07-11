#########################################################
# Topic 1 - Advanced VPC Networking
#########################################################

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#########################################################
# VPC A
#########################################################

resource "aws_vpc" "vpc_a" {
  cidr_block           = var.vpc_a_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "VPC-A"
  }
}

#########################################################
# VPC B
#########################################################

resource "aws_vpc" "vpc_b" {
  cidr_block           = var.vpc_b_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "VPC-B"
  }
}

#########################################################
# Public Subnet
#########################################################

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.vpc_a.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "Public-Subnet"
  }
}

#########################################################
# Private Subnet
#########################################################

resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.vpc_a.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "Private-Subnet"
  }
}

#########################################################
# Internet Gateway
#########################################################

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc_a.id

  tags = {
    Name = "Internet-Gateway"
  }
}

#########################################################
# Elastic IP
#########################################################

resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "NAT-EIP"
  }
}

#########################################################
# NAT Gateway
#########################################################

resource "aws_nat_gateway" "nat_gateway" {

  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnet.id

  depends_on = [
    aws_internet_gateway.igw
  ]

  tags = {
    Name = "NAT-Gateway"
  }
}

#########################################################
# Public Route Table
#########################################################

resource "aws_route_table" "public_rt" {

  vpc_id = aws_vpc.vpc_a.id

  route {

    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id

  }

  tags = {

    Name = "Public-Route-Table"

  }

}

#########################################################
# Private Route Table
#########################################################

resource "aws_route_table" "private_rt" {

  vpc_id = aws_vpc.vpc_a.id

  route {

    cidr_block     = "0.0.0.0/0"

    nat_gateway_id = aws_nat_gateway.nat_gateway.id

  }

  tags = {

    Name = "Private-Route-Table"

  }

}

#########################################################
# Route Table Associations
#########################################################

resource "aws_route_table_association" "public_assoc" {

  subnet_id = aws_subnet.public_subnet.id

  route_table_id = aws_route_table.public_rt.id

}

resource "aws_route_table_association" "private_assoc" {

  subnet_id = aws_subnet.private_subnet.id

  route_table_id = aws_route_table.private_rt.id

}

#########################################################
# VPC Peering
#########################################################

resource "aws_vpc_peering_connection" "peer" {

  vpc_id = aws_vpc.vpc_a.id

  peer_vpc_id = aws_vpc.vpc_b.id

  auto_accept = true

  tags = {

    Name = "VPC-Peering"

  }

}

#########################################################
# Transit Gateway
#########################################################

resource "aws_ec2_transit_gateway" "tgw" {

  description = "Main Transit Gateway"

  dns_support = "enable"

  vpn_ecmp_support = "enable"

  tags = {

    Name = "Transit-Gateway"

  }

}

#########################################################
# Transit Gateway Attachment - VPC A
#########################################################

resource "aws_ec2_transit_gateway_vpc_attachment" "attach_a" {

  subnet_ids = [

    aws_subnet.private_subnet.id

  ]

  transit_gateway_id = aws_ec2_transit_gateway.tgw.id

  vpc_id = aws_vpc.vpc_a.id

}

#########################################################
# Private Subnet for VPC B
#########################################################

resource "aws_subnet" "vpc_b_private" {

  vpc_id = aws_vpc.vpc_b.id

  cidr_block = "10.1.1.0/24"

  availability_zone = "${var.aws_region}a"

}

#########################################################
# Transit Gateway Attachment - VPC B
#########################################################

resource "aws_ec2_transit_gateway_vpc_attachment" "attach_b" {

  subnet_ids = [

    aws_subnet.vpc_b_private.id

  ]

  transit_gateway_id = aws_ec2_transit_gateway.tgw.id

  vpc_id = aws_vpc.vpc_b.id

}

#########################################################
# PrivateLink Endpoint
#########################################################

resource "aws_vpc_endpoint" "s3_endpoint" {

  vpc_id = aws_vpc.vpc_a.id

  service_name = "com.amazonaws.${var.aws_region}.s3"

  vpc_endpoint_type = "Interface"

  subnet_ids = [

    aws_subnet.private_subnet.id

  ]

  private_dns_enabled = false

  tags = {

    Name = "S3-PrivateLink"

  }

}