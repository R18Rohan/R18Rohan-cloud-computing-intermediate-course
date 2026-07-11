##############################################################
# Topic 3 - High Availability & Auto Scaling
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

  type    = string
  default = "us-east-1"

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

data "aws_subnet" "public2" {

  id = var.public_subnet_2

}

##############################################################
# Existing Public Route Table
##############################################################

data "aws_route_table" "public_rt" {

  subnet_id = data.aws_subnet.public1.id

}

##############################################################
# Latest Amazon Linux 2 AMI
##############################################################

data "aws_ami" "amazon_linux" {

  most_recent = true

  owners = ["amazon"]

  filter {

    name = "name"

    values = [
      "al2023-ami-2023.*-x86_64"
    ]

  }

}




##############################################################
# Route Table Association
##############################################################


##############################################################
# Security Group
##############################################################

resource "aws_security_group" "web_sg" {

  name = "topic3-web-sg"

  description = "Security Group for Topic 3"

  vpc_id = data.aws_vpc.main.id

  ingress {

    from_port = 80
    to_port   = 80

    protocol = "tcp"

    cidr_blocks = [

      "0.0.0.0/0"

    ]

  }

  ingress {

    from_port = 22
    to_port   = 22

    protocol = "tcp"

    cidr_blocks = [

      "0.0.0.0/0"

    ]

  }

  egress {

    from_port = 0
    to_port   = 0
    protocol  = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]

  }

  tags = {

    Name = "Topic3-Web-SG"

  }

}

##############################################################
# Launch Template
##############################################################

resource "aws_launch_template" "app_lt" {

  name_prefix = "production-app-template-"

  image_id = data.aws_ami.amazon_linux.id

  instance_type = "t3.micro"

  monitoring {

    enabled = true

  }

  vpc_security_group_ids = [

    aws_security_group.web_sg.id

  ]

  user_data = base64encode(<<EOF
#!/bin/bash
yum update -y
yum install -y httpd
systemctl enable httpd
systemctl start httpd

INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

cat <<HTML >/var/www/html/index.html
<html>
<head><title>Topic 3</title></head>
<body style="text-align:center;font-family:Arial;">
<h1>High Availability & Auto Scaling</h1>
<h2>Terraform Deployment Successful</h2>
<p>Instance: $INSTANCE_ID</p>
</body>
</html>
HTML
EOF
  )

  tag_specifications {

    resource_type = "instance"

    tags = {

      Name = "ASG-Web-Instance"

    }

  }

}

##############################################################
# Application Load Balancer
##############################################################

resource "aws_lb" "external_alb" {

  name = "topic3-alb"

  internal = false

  load_balancer_type = "application"

  security_groups = [

    aws_security_group.web_sg.id

  ]

  subnets = [

    data.aws_subnet.public1.id,
    data.aws_subnet.public2.id

  ]

  tags = {

    Name = "Topic3-ALB"

  }

}

##############################################################
# Target Group
##############################################################

resource "aws_lb_target_group" "web_tg" {

  name = "asg-web-target-group"

  port = 80

  protocol = "HTTP"

  vpc_id = data.aws_vpc.main.id

  target_type = "instance"

  health_check {

    path = "/"

    protocol = "HTTP"

    interval = 30

    timeout = 5

    healthy_threshold = 2

    unhealthy_threshold = 2

  }

  tags = {

    Name = "Topic3-TG"

  }

}

##############################################################
# HTTP Listener
##############################################################

resource "aws_lb_listener" "http" {

  load_balancer_arn = aws_lb.external_alb.arn

  port     = 80
  protocol = "HTTP"

  default_action {

    type = "forward"

    target_group_arn = aws_lb_target_group.web_tg.arn

  }

}

##############################################################
# Path Based Routing Rule
##############################################################

resource "aws_lb_listener_rule" "api_rule" {

  listener_arn = aws_lb_listener.http.arn

  priority = 100

  action {

    type = "forward"

    target_group_arn = aws_lb_target_group.web_tg.arn

  }

  condition {

    path_pattern {

      values = [
        "/api/*"
      ]

    }

  }

}

##############################################################
# Auto Scaling Group
##############################################################

resource "aws_autoscaling_group" "app_asg" {

  name_prefix = "production-asg-"

  min_size         = 1
  desired_capacity = 2
  max_size         = 5

  health_check_type         = "ELB"
  health_check_grace_period = 300

  vpc_zone_identifier = [

    data.aws_subnet.public1.id,
    data.aws_subnet.public2.id

  ]

  target_group_arns = [

    aws_lb_target_group.web_tg.arn

  ]

  launch_template {

    id = aws_launch_template.app_lt.id

    version = "$Latest"

  }

  tag {

    key = "Name"

    value = "Production-ASG-Instance"

    propagate_at_launch = true

  }

  depends_on = [

    aws_lb_listener.http

  ]

}

##############################################################
# Target Tracking Auto Scaling Policy
##############################################################

resource "aws_autoscaling_policy" "cpu_target_tracking" {

  name = "cpu-target-tracking-policy"

  autoscaling_group_name = aws_autoscaling_group.app_asg.name

  policy_type = "TargetTrackingScaling"

  target_tracking_configuration {

    predefined_metric_specification {

      predefined_metric_type = "ASGAverageCPUUtilization"

    }

    target_value = 70

  }

}

##############################################################
# Outputs
##############################################################

output "alb_dns_name" {

  value = aws_lb.external_alb.dns_name

}

output "launch_template_id" {

  value = aws_launch_template.app_lt.id

}

output "autoscaling_group_name" {

  value = aws_autoscaling_group.app_asg.name

}

output "target_group_arn" {

  value = aws_lb_target_group.web_tg.arn

}

output "security_group_id" {

  value = aws_security_group.web_sg.id

}

output "public_subnet_2" {

  value = data.aws_subnet.public2.id

}