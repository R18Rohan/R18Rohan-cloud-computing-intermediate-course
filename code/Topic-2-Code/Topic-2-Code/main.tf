##############################################################
# Topic 2 - Containers on AWS
# Docker + Amazon ECR + Amazon ECS + AWS Fargate
##############################################################

terraform {

  required_version = ">= 1.5.0"

  required_providers {

    aws = {

      source  = "hashicorp/aws"

      version = "~> 6.0"

    }

  }

}

##############################################################
# AWS Provider
##############################################################

provider "aws" {

  region = var.aws_region

}

##############################################################
# Variables
##############################################################

variable "aws_region" {

  default = "us-east-1"

}

variable "vpc_id" {}

variable "public_subnet_1" {}

##############################################################
# Existing VPC
##############################################################

data "aws_vpc" "main" {

  id = var.vpc_id

}

##############################################################
# Existing Public Subnet
##############################################################

data "aws_subnet" "public1" {

  id = var.public_subnet_1

}

##############################################################
# Second Public Subnet
##############################################################

resource "aws_subnet" "public2" {

  vpc_id = data.aws_vpc.main.id

  cidr_block = "10.0.3.0/24"

  availability_zone = "us-east-1b"

  map_public_ip_on_launch = true

  tags = {

    Name = "Public-Subnet-2"

  }

}

##############################################################
# Find Internet Gateway
##############################################################

data "aws_internet_gateway" "igw" {

  filter {

    name = "attachment.vpc-id"

    values = [

      data.aws_vpc.main.id

    ]

  }

}

##############################################################
# Public Route Table
##############################################################

data "aws_route_table" "public_rt" {

  subnet_id = data.aws_subnet.public1.id

}

##############################################################
# Associate Public Subnet 2
##############################################################

resource "aws_route_table_association" "public2_assoc" {

  subnet_id = aws_subnet.public2.id

  route_table_id = data.aws_route_table.public_rt.id

}

##############################################################
# Security Group
##############################################################

resource "aws_security_group" "ecs_sg" {

  name = "ecs-fargate-sg"

  description = "Security Group for ECS"

  vpc_id = data.aws_vpc.main.id

  ingress {

    from_port = 80

    to_port = 80

    protocol = "tcp"

    cidr_blocks = [

      "0.0.0.0/0"

    ]

  }

  ingress {

    from_port = 3000

    to_port = 3000

    protocol = "tcp"

    cidr_blocks = [

      "0.0.0.0/0"

    ]

  }

  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = [

      "0.0.0.0/0"

    ]

  }

  tags = {

    Name = "ECS-Security-Group"

  }

}

##############################################################
# ECS Task Execution Role
##############################################################

resource "aws_iam_role" "ecs_execution_role" {

  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Effect = "Allow"

        Principal = {

          Service = "ecs-tasks.amazonaws.com"

        }

        Action = "sts:AssumeRole"

      }

    ]

  })

}

##############################################################
# ECS Execution Policy
##############################################################

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {

  role = aws_iam_role.ecs_execution_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"

}

##############################################################
# Amazon Elastic Container Registry (ECR)
##############################################################

resource "aws_ecr_repository" "app_repo" {

  name                 = "production-web-app"

  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {

    scan_on_push = true

  }

  tags = {

    Environment = "Production"

    Project = "Topic-2"

  }

}

##############################################################
# Amazon ECS Cluster
##############################################################

resource "aws_ecs_cluster" "app_cluster" {

  name = "production-app-cluster"

  tags = {

    Environment = "Production"

    Project = "Topic-2"

  }

}

##############################################################
# ECS Task Definition
##############################################################

resource "aws_ecs_task_definition" "app_task" {

  family = "production-web-app"

  requires_compatibilities = [

    "FARGATE"

  ]

  network_mode = "awsvpc"

  cpu = "256"

  memory = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([

    {

      name = "production-web-app"

      image = "${aws_ecr_repository.app_repo.repository_url}:latest"

      essential = true

      portMappings = [

        {

          containerPort = 3000

          hostPort = 3000

          protocol = "tcp"

        }

      ]

    }

  ])

  depends_on = [

    aws_iam_role_policy_attachment.ecs_execution_policy

  ]

  tags = {

    Project = "Topic-2"

  }

}

##############################################################
# Application Load Balancer
##############################################################

resource "aws_lb" "app_alb" {

  name               = "production-app-alb"

  internal           = false

  load_balancer_type = "application"

  security_groups = [

    aws_security_group.ecs_sg.id

  ]

  subnets = [

    data.aws_subnet.public1.id,

    aws_subnet.public2.id

  ]

  tags = {

    Project = "Topic-2"

  }

}

##############################################################
# Target Group
##############################################################

resource "aws_lb_target_group" "app_tg" {

  name = "production-app-tg"

  port = 3000

  protocol = "HTTP"

  target_type = "ip"

  vpc_id = data.aws_vpc.main.id

  health_check {

    path = "/"

    interval = 30

    timeout = 5

    healthy_threshold = 2

    unhealthy_threshold = 2

  }

}

##############################################################
# Listener
##############################################################

resource "aws_lb_listener" "http_listener" {

  load_balancer_arn = aws_lb.app_alb.arn

  port = 80

  protocol = "HTTP"

  default_action {

    type = "forward"

    target_group_arn = aws_lb_target_group.app_tg.arn

  }

}

##############################################################
# ECS Service
##############################################################

resource "aws_ecs_service" "app_service" {

  name = "production-web-service"

  cluster = aws_ecs_cluster.app_cluster.id

  task_definition = aws_ecs_task_definition.app_task.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {

    subnets = [

      data.aws_subnet.public1.id,

      aws_subnet.public2.id

    ]

    security_groups = [

      aws_security_group.ecs_sg.id

    ]

    assign_public_ip = true

  }

  load_balancer {

    target_group_arn = aws_lb_target_group.app_tg.arn

    container_name = "production-web-app"

    container_port = 3000

  }

  depends_on = [

    aws_lb_listener.http_listener

  ]

}


##############################################################
# Outputs
##############################################################

output "ecr_repository_url" {

  value = aws_ecr_repository.app_repo.repository_url

}

output "ecs_cluster_name" {

  value = aws_ecs_cluster.app_cluster.name

}

output "alb_dns_name" {

  value = aws_lb.app_alb.dns_name

}