# Implementation Docs: Topic 2 - Containers on AWS: Docker, ECR, ECS Fargate & Container Architecture

## Overview
This document walks the learner through containerizing applications and deploying them on AWS. It covers writing multi-stage Dockerfiles to compile code securely, pushing images to ECR, declaring ECS Fargate compute tasks and services, and setting up Application Load Balancers (ALBs) to route traffic to running container tasks.

## Prerequisites
- Docker installed locally for container image builds.
- Terraform CLI installed (v1.5.0 or later).
- Node.js installed (v18.0.0 or later).
- Complete understanding of ports, DNS records, container virtualization, and HTTP load balancers.
- Source code extracted from `Topic-2-Code.zip`.

---

## Part 1: ECS Fargate Load Balancing Architecture

```
   [Traffic Port 80/443] ──────► Application Load Balancer (ALB)
                                              │
                                              ▼ Target Group Routing
                                       (Target Type: "ip")
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
     [Fargate Task 1 (Port 3000)]                     [Fargate Task 2 (Port 3000)]
   ┌─────────────────────────────┐                  ┌─────────────────────────────┐
   │ - Node.js App container     │                  │ - Node.js App container     │
   │ - Running on Serverless     │                  │ - Running on Serverless     │
   │   Fargate infrastructure    │                  │   Fargate infrastructure    │
   └─────────────────────────────┘                  └─────────────────────────────┘
```

---

## Part 2: Setup and Execution Guide

### Step 1: Navigating and Installing Packages
Open your terminal and run:
```bash
cd Topic-2-Code
npm install
```

### Step 2: Running Fargate Config Verification Tests
- To run Jest to verify Fargate CPU, memory, and ECR configurations:
  ```bash
  npm run test
  ```

### Step 3: Local Docker Image Compilation
- To build the multi-stage Dockerfile locally:
  ```bash
  docker build -t production-web-app:v1.0.0 .
  ```

### Step 4: Initializing and Planning Terraform
- To initialize and verify the ECS Fargate IaC configuration:
  ```bash
  terraform init
  terraform plan
  ```

---

## Part 3: Code Implementation Details

### 1. Multi-Stage Dockerfile (Dockerfile)
Open `Dockerfile`. The file splits dependencies compilation from application running, reducing image size:
```dockerfile
# Build Stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

# Runner Stage
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/containerDeployer.js"]
```

### 2. Infrastructure as Code (main.tf)
Open `main.tf`. Here, we declare the AWS container resources:
- **ECR Repository**: Configured with mutable tag permissions and automated image vulnerability scanning.
- **ECS Cluster**: Cluster container pool.
- **ECS Task Definition**: Configured for `FARGATE` launch compatibility, requiring the `awsvpc` network mode.
- **ALB Target Group**: Configured with target type `ip` to resolve tasks inside private subnets dynamically.
- **ECS Service**: Manages rolling deployments of task definitions behind the ALB target group.

### 3. Fargate Configurations Auditor (src/containerDeployer.ts)
Open `src/containerDeployer.ts`. The auditor checks container variables for production deployment compliance:
- CPU settings must be valid Fargate sizes.
- Memory size allocations must match CPU guidelines.
- Container exposed ports must match target group ports (`3000`).
- Mutable image tags (like `latest`) are flagged to prevent deployment drift.

---

## Part 4: AWS Container Checklist and Best Practices

| Component | Recommended Practice | Avoid |
|---|---|---|
| Dockerfile | Use multi-stage builds to remove compilation tools from the final production container image. | Avoid running container processes as the `root` user (use a dedicated service user instead). |
| ECR Registry | Apply lifecycle rules to automatically prune old untagged container images. | Avoid pushing images using mutable tags (like `latest`) to production registries. |
| ECS Fargate | Configure ECS Service desired task count to be at least 2 across different Availability Zones. | Avoid using the `EC2` launch type unless you require low-level operating system configurations. |
| ALB Routing | Set healthy threshold checks to use dedicated lightweight health endpoints (e.g. `/health`). | Avoid using resource-heavy endpoints for load balancer health checks. |

---

## Part 5: Cleanup
To delete testing dependencies and restore the environment:
```bash
rm -rf node_modules dist
```
