##############################################################
# Outputs
##############################################################

output "ecs_cluster_name" {

  value = aws_ecs_cluster.main.name

}

output "alb_dns_name" {

  value = aws_lb.app_alb.dns_name

}

output "rds_endpoint" {

  value = aws_db_instance.mysql.endpoint

}

output "kms_key_arn" {

  value = aws_kms_key.rds_kms.arn

}

output "security_group_id" {

  value = aws_security_group.app_sg.id

}