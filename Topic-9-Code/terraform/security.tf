##############################################################
# Security Group for ALB, ECS and RDS
##############################################################

resource "aws_security_group" "app_sg" {

  name        = "topic9-app-sg"
  description = "Security Group for Topic 9 Infrastructure"
  vpc_id      = data.aws_vpc.main.id

  ##############################################################
  # HTTP
  ##############################################################

  ingress {

    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  ##############################################################
  # HTTPS
  ##############################################################

  ingress {

    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  ##############################################################
  # ECS Application Port
  ##############################################################

  ingress {

    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  ##############################################################
  # MySQL
  ##############################################################

  ingress {

    from_port = 3306
    to_port   = 3306
    protocol  = "tcp"
    self      = true

  }

  ##############################################################
  # Outbound
  ##############################################################

  egress {

    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {

    Name = "Topic9-SecurityGroup"

  }

}
