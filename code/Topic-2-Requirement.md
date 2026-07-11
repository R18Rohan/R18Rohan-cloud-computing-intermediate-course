# Requirement File: Topic 2 - Containers on AWS: Docker, ECR, ECS Fargate & Container Architecture

## 1. Learning Concepts
- **Docker Containerization**: Packaging application code and dependency binaries into isolated, lightweight images using Dockerfiles (commands: `FROM`, `WORKDIR`, `RUN`, `COPY`, `EXPOSE`, `CMD`).
- **Amazon ECR (Elastic Container Registry)**: Authenticating registries, pushing images using specific tag conventions, and setting up lifecycle policies.
- **AWS ECS Fargate**: Running container workloads in a serverless model (no EC2 server provisioning) using task definitions (mapping CPU, Memory, and IAM roles) inside services and clusters.
- **ALB Load Balancing**: Integrating Application Load Balancers with ECS Fargate services to distribute incoming HTTP/HTTPS traffic to running tasks.
- **Container Architecture Patterns**: Configuring task definitions, scaling services, and defining target group health check variables.

## 2. Practice Hands-on Concept with Syntax
- **Objective**: Author multi-stage Dockerfiles and write Terraform IaC files to declare ECR repositories, ECS clusters, Fargate tasks, services, and ALBs.
- **Syntax Examples**:
  - *Multi-Stage Dockerfile*:
    ```dockerfile
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    FROM node:18-alpine AS runner
    WORKDIR /app
    COPY --from=builder /app/dist ./dist
    CMD ["node", "dist/app.js"]
    ```
  - *Terraform ECR Repository*:
    ```hcl
    resource "aws_ecr_repository" "repo" {
        name = "production-app-repo"
        image_scanning_configuration { scan_on_push = true }
    }
    ```
  - *Terraform ECS Fargate Task Definition*:
    ```hcl
    resource "aws_ecs_task_definition" "task" {
        family                   = "web-task"
        network_mode             = "awsvpc"
        requires_compatibilities = ["FARGATE"]
        cpu                      = "256"
        memory                   = "512"
        container_definitions    = jsonencode([...])
    }
    ```

## 3. BRD (Business Requirements Document)
| ID | Business Requirement | Rationale | Priority |
|---|---|---|---|
| BRD-01 | Standardize application runtimes across environments. | Docker containers package all dependencies, eliminating "works on my machine" issues. | High |
| BRD-02 | Reduce server management overhead. | ECS Fargate abstracts virtual machine provisioning, allowing developers to focus solely on container code. | High |
| BRD-03 | Prevent downtime during application deployments. | ALB target groups distribute traffic to healthy container tasks, enabling rolling zero-downtime updates. | High |

## 4. PRD (Product Requirements Document)
| ID | Product Requirement | User Value | Priority |
|---|---|---|---|
| PRD-01 | Secure storage for container builds. | Private ECR repositories scan images automatically for security vulnerabilities on push. | High |
| PRD-02 | Automatic recovery of failing apps. | ECS services monitor health check statuses and automatically replace crashed container tasks. | High |
| PRD-03 | Handle sudden traffic spikes. | Fargate task configurations scale up desire counts dynamically behind an ALB. | Medium |

## 5. SRS / Technical Requirements
| ID | Requirement | Category | Priority |
|---|---|---|---|
| SRS-01 | The Dockerfile must utilize multi-stage builds to produce minimized runtime images. | Dockerfile | High |
| SRS-02 | ECS task definitions must map to valid Fargate CPU/memory combinations (e.g. 256 CPU to 512MB-2GB Memory). | Fargate Task | High |
| SRS-03 | ECS Fargate task ports must match the exposed application ports inside target groups. | Port Mapping | High |
| SRS-04 | The Application Load Balancer target group must utilize the `"ip"` target type to route traffic in `"awsvpc"` network mode. | Load Balancing | High |

## 6. User Stories
| ID | User Story | Priority |
|---|---|---|
| US-01 | As a developer, I want to write a multi-stage Dockerfile so that my production container images remain minimal and secure. | High |
| US-02 | As a cloud engineer, I want to deploy container tasks to ECS Fargate without managing underlying EC2 server hosts. | High |
| US-03 | As a system administrator, I want to attach my ECS service to an ALB target group to load balance incoming HTTP requests. | High |

## 7. Acceptance Criteria
| User Story | Acceptance Criteria |
|---|---|
| US-01 | 1. Dockerfile contains builder and runner stages. 2. Final image contains only dependencies required for runtime. |
| US-02 | 1. ECS task definition specifies `FARGATE` compatibility. 2. CPU/memory mappings conform to Fargate constraints. |
| US-03 | 1. ALB listener forwards port 80 to the target group. 2. Target group healthy threshold checks target port 3000. |

## 8. Test Cases
| ID | Test Case | Expected Result |
|---|---|---|
| TC-01 | Verify valid Fargate configurations. | Auditing task setups with 256 CPU, 512MB memory, and port 3000 returns valid status. |
| TC-02 | Verify invalid Fargate CPU values. | Auditing non-standard CPU units (e.g. 300 CPU) flags an invalid CPU size configuration. |
| TC-03 | Verify invalid Fargate memory ratios. | Auditing mismatched memory settings (e.g. 256 CPU with 4GB memory) flags invalid task allocations. |
| TC-04 | Verify mismatched port mappings. | Auditing containers exposing non-default ports (e.g. 8080 instead of 3000) flags exposed port violations. |
| TC-05 | Verify mutable ECR tags. | Auditing task configurations using the `latest` image tag flags mutable tag warnings for production deployments. |

## 9. Assumptions
- AWS account has ECR, ECS, and ALB resources limits available.
- Network VPC configurations exist with private and public subnets.

## 10. Dependencies
- Docker CLI installed locally for container image builds.
- Terraform CLI for deploying AWS infrastructure.
- Node.js runtime and Jest testing tools.

## 11. Risks
- ECS Fargate container initialization delays (cold starts). (Mitigation: Maintain minimum desired task counts of at least 2).
- ECR storage costs for old container images. (Mitigation: Enforce ECR lifecycle rules to expire untagged images automatically).

## 12. Glossary
- **Docker**: A platform used to develop, ship, and run applications inside containers.
- **ECR (Elastic Container Registry)**: A managed AWS Docker registry used to store, manage, and deploy container images.
- **ECS (Elastic Container Service)**: A managed container orchestration service that supports Docker containers.
- **Fargate**: A serverless compute engine for containers that works with ECS.
- **ALB (Application Load Balancer)**: A load balancer that routes application layer traffic (HTTP/HTTPS) based on request content.
- **Task Definition**: A blueprint that describes how a container should be launched in ECS (CPU, memory, port mappings).
