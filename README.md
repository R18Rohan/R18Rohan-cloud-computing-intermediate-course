# AWS Cloud Computing Intermediate Course — Hands-On Codebase

Welcome to the **AWS Cloud Computing Intermediate Course** hands-on project repository. This codebase represents a comprehensive, practical journey covering advanced cloud architecture, modern software engineering, Infrastructure as Code (IaC), serverless technologies, containerization, DevSecOps, and full-stack application deployment.

---

## 📂 Repository Structure

The repository is organized by topics, each focusing on a specific cloud domain paired with advanced software engineering concepts, complete with test suites for validation.

| Topic / Folder | Cloud Concepts & AWS Services | Software Engineering & Language Patterns |
| :--- | :--- | :--- |
| 🌐 **[Topic-1-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-1-Code)** | VPCs, Subnets, Gateways, Route Tables, Security Groups, NACLs | Network Architecture & Infrastructure Simulation |
| 🐳 **[Topic-2-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/code/Topic-2-Code/Topic-2-Code)** | Amazon ECR, ECS Fargate, Application Load Balancers (ALB) | Multi-stage Dockerfiles, Container Audits & ECS task configurations |
| ⚡ **[Topic-3-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-3-Code)** | Auto Scaling, Multi-AZ, Route 53, CloudWatch Monitoring | High Availability & Resilience Simulation / Testing |
| 🤖 **[Topic-4-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-4-Code/Topic-4-Code)** | AWS Lambda, API Gateway, DynamoDB, Step Functions, EventBridge | Modern JS (Generators, Custom Iterables, WeakMap/WeakSet), Docker Auditing |
| 🔄 **[Topic-5-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-5-Code)** | GitHub Actions, AWS CodePipeline, CodeBuild, CodeDeploy | GoF Design Patterns (Singleton, Factory, Observer, Strategy, Proxy) |
| 🔒 **[Topic-6-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-6-Code/Topic-6-Code)** | AWS IAM (Policies & Roles), AWS KMS (Encryption Keys) | Security Auditor, Browser APIs (Storage, History Router, Clipboard) |
| 🛡️ **[Topic-7-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-7-Code/Topic-7-Code)** | DevSecOps, IaC Auditing, Policy-as-Code (Open Policy Agent - Rego) | Performance & Optimization (Debounce, Throttle, Memoize, Memory Leaks) |
| 💸 **[Topic-8-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-8-Code)** | Cloud Native Design, AWS Cost Auditing & Optimization | Functional Programming (Immutability, Lens, Reactive, Piping) |
| 🚀 **[Topic-9-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-9-Code)** | Full Stack Capstone: ECS, RDS, ALB, Terraform, Kubernetes | Next.js Frontend, Node.js/TypeScript Backend, Advanced Map/Set Collections |
| 📖 **[Topic-10-Code](file:///c:/Users/uniqu/Downloads/cloud%20hands%20on%20intermediate%20course/Topic-10-Code)** | Runbooks, Operational Excellence, Incident Response | Runbook Auditing, Math Utilities, Toolchain Verification |

---

## 🛠️ Core Technologies & Tools

- **Cloud Platform**: Amazon Web Services (AWS)
- **Infrastructure as Code (IaC)**: Terraform
- **Containerization & Orchestration**: Docker, Kubernetes (K8s), ECS Fargate
- **Backend / Scripting**: Node.js, TypeScript, Express
- **Frontend Framework**: Next.js (React)
- **Testing**: Jest (Unit & Integration tests)
- **Security & Compliance**: Open Policy Agent (OPA/Rego) for Policy-as-Code

---

## 🚀 Getting Started

### Prerequisites

To run and test the projects locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/)
- [Terraform CLI](https://developer.hashicorp.com/terraform/downloads)
- [Git](https://git-scm.com/)

### Installation

Clone the repository and install dependencies inside any of the topic folders:

```bash
# Clone the repository
git clone https://github.com/R18Rohan/R18Rohan-cloud-computing-intermediate-course.git

# Navigate into a specific topic directory
cd Topic-8-Code

# Install local dependencies
npm install
```

### Running Tests

Each topic contains a dedicated test suite with Jest. You can execute the tests by running:

```bash
# Run unit & integration tests
npm test
```

---

## 🏗️ Terraform Commands & Usage

Since Terraform is used throughout this repository for Infrastructure as Code (IaC), here is a reference for the essential commands, their purposes, and how they apply to the projects:

### 1. `terraform init`
- **Purpose**: Initializes a new or existing Terraform working directory. It downloads the required provider plugins (such as `aws` or `random`), sets up modules, and configures the backend state repository.
- **Usage**: Run this first whenever you navigate to a directory containing `.tf` files.
  ```bash
  terraform init
  ```

### 2. `terraform validate`
- **Purpose**: Checks whether the configuration is syntactically valid and internally consistent. It verifies resource properties, variable definitions, and types without querying real cloud APIs.
- **Usage**: Use this to check for syntax errors before running a plan.
  ```bash
  terraform validate
  ```

### 3. `terraform fmt`
- **Purpose**: Formats all configuration files in the current directory to conform to standard Terraform language style guidelines (consistent indentation, alignment, and formatting).
- **Usage**: Run this to clean up file styling.
  ```bash
  terraform fmt
  ```

### 4. `terraform plan`
- **Purpose**: Generates an execution plan. It compares the current state of resources in AWS with the configuration files and details what changes (additions, modifications, or deletions) will be made.
- **Usage**: Review the plan carefully to ensure it aligns with your expectations.
  ```bash
  terraform plan
  ```

### 5. `terraform apply`
- **Purpose**: Applies the changes required to reach the desired state of the configuration. It communicates with AWS APIs to provision, modify, or delete infrastructure resources.
- **Usage**: Run this to deploy your configuration. Use `-auto-approve` in non-interactive/automation environments.
  ```bash
  terraform apply
  ```

### 6. `terraform destroy`
- **Purpose**: Destroys all remote resources managed by the current Terraform configuration. This is critical for clearing cloud infrastructure once your testing or lab session is complete to prevent unintended charges.
- **Usage**:
  ```bash
  terraform destroy
  ```

### 7. `terraform state`
- **Purpose**: Performs advanced state management. Terraform tracks the current infrastructure mapping in a state file (`terraform.tfstate`). This command lets you list, show, or inspect objects in the state safely.
- **Usage**:
  ```bash
  # List all resources currently tracked in state
  terraform state list
  ```

---

## 📝 Topic Highlights

### ⚡ Topic 4: Serverless & Event-Driven Systems
Implementation of Event-Driven Architectures utilizing AWS Step Functions, EventBridge routers, and serverless compute (Lambda). Accompanied by modern JavaScript patterns such as generators and custom iterators.

### 🛡️ Topic 7: DevSecOps & IaC Auditing
Demonstrates Policy-as-Code implementations using Open Policy Agent (OPA) with Rego to audit Terraform files for security and compliance violations before deployment.

### 💸 Topic 8: Cost Auditing & Functional Programming
An auditor that evaluates cloud resources against AWS Cost Optimization pillars. Built using functional programming principles (immutability, lens, currying, and functional pipes).

### 🚀 Topic 9: Full-Stack Capstone
A production-grade architecture deployment script including Next.js, Node.js/Express, a managed relational database (RDS), elastic container services, networking load balancers, and a Kubernetes deployment descriptor.

---

## 🔒 License
This repository is configured for educational purposes as part of the Cloud Computing Intermediate Course. All rights reserved.
