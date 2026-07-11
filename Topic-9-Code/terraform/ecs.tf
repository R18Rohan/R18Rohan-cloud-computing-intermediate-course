##############################################################
# CloudWatch Log Group
##############################################################

resource "aws_cloudwatch_log_group" "ecs_logs" {

  name              = "/ecs/topic9"
  retention_in_days = 7

}

##############################################################
# ECS Cluster
##############################################################

resource "aws_ecs_cluster" "main" {

  name = "topic9-cluster"

}

##############################################################
# ECS Task Definition
##############################################################

resource "aws_ecs_task_definition" "app" {

  family                   = "topic9-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  cpu    = "256"
  memory = "512"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([

    {

      name = "topic9-app"

      image = "nginx:latest"

      essential = true

      portMappings = [

        {

          containerPort = 80
          hostPort      = 80

        }

      ]

      logConfiguration = {

        logDriver = "awslogs"

        options = {

          awslogs-group         = aws_cloudwatch_log_group.ecs_logs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"

        }

      }

    }

  ])

}

##############################################################
# ECS Service
##############################################################

resource "aws_ecs_service" "app" {

  name = "topic9-service"

  cluster = aws_ecs_cluster.main.id

  task_definition = aws_ecs_task_definition.app.arn

  desired_count = 1

  launch_type = "FARGATE"

  network_configuration {

    assign_public_ip = true

    security_groups = [

      aws_security_group.app_sg.id

    ]

    subnets = [

      data.aws_subnet.public1.id,
      data.aws_subnet.public2.id

    ]

  }

  load_balancer {

    target_group_arn = aws_lb_target_group.ecs_tg.arn

    container_name = "topic9-app"

    container_port = 80

  }

  depends_on = [

    aws_lb_listener.http

  ]

}