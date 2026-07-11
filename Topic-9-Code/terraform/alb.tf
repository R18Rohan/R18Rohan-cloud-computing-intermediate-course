##############################################################
# Application Load Balancer
##############################################################

resource "aws_lb" "app_alb" {

  name = "topic9-alb"

  internal = false

  load_balancer_type = "application"

  security_groups = [

    aws_security_group.app_sg.id

  ]

  subnets = [

    data.aws_subnet.public1.id,
    data.aws_subnet.public2.id

  ]

  tags = {

    Name = "Topic9-ALB"

  }

}

##############################################################
# Target Group
##############################################################

resource "aws_lb_target_group" "ecs_tg" {

  name = "topic9-target-group"

  port = 80

  protocol = "HTTP"

  target_type = "ip"

  vpc_id = data.aws_vpc.main.id

  health_check {

    path = "/"

    protocol = "HTTP"

  }

}

##############################################################
# HTTP Listener
##############################################################

resource "aws_lb_listener" "http" {

  load_balancer_arn = aws_lb.app_alb.arn

  port = 80

  protocol = "HTTP"

  default_action {

    type = "forward"

    target_group_arn = aws_lb_target_group.ecs_tg.arn

  }

}