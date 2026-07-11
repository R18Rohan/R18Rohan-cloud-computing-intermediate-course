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
