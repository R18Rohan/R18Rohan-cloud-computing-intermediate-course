##############################################################
# RDS Subnet Group
##############################################################

resource "aws_db_subnet_group" "db_subnet_group" {

  name = "topic9-db-subnet-group"

  subnet_ids = [

    data.aws_subnet.public1.id,
    data.aws_subnet.public2.id

  ]

  tags = {

    Name = "Topic9-DB-SubnetGroup"

  }

}

##############################################################
# Amazon RDS MySQL
##############################################################

resource "aws_db_instance" "mysql" {

  identifier = "topic9-mysql-db"

  engine = "mysql"

  engine_version = "8.0"

  instance_class = "db.t3.micro"

  allocated_storage = 20

  username = var.db_username

  password = var.db_password

  db_subnet_group_name = aws_db_subnet_group.db_subnet_group.name

  vpc_security_group_ids = [

    aws_security_group.app_sg.id

  ]

  multi_az = true

  publicly_accessible = false

  storage_encrypted = true

  kms_key_id = aws_kms_key.rds_kms.arn

  skip_final_snapshot = true

  deletion_protection = false

  tags = {

    Name = "Topic9-RDS"

  }

}