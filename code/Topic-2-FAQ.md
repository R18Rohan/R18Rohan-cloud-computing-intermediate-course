# FAQ: Topic 2 - Containers on AWS: Docker, ECR, ECS Fargate & Container Architecture

## Frequently Asked Questions

### 1. What is the difference between a Virtual Machine (VM) and a Container?
- **Virtual Machine**: Packages an application alongside a complete Guest Operating System (OS). Each VM runs on top of a hypervisor, which emulates hardware resources, resulting in larger sizes and slower startup times.
- **Container**: Packages an application and its dependencies, but shares the host OS kernel with other containers. This makes containers lightweight, highly portable, and fast to start.

### 2. Why are multi-stage builds recommended in Dockerfiles?
Multi-stage builds allow you to use different base images for different stages of the build process. You can compile your code (e.g. compiling TypeScript using heavy devDependencies) in a temporary builder stage, and copy only the compiled production assets into a final, minimal runner image, reducing the production image size.

### 3. What is the difference between Amazon ECS and AWS Fargate?
- **Amazon ECS (Elastic Container Service)**: A container orchestration service used to manage container clusters, schedule tasks, and control services.
- **AWS Fargate**: A serverless compute engine that works with ECS. It allows you to run containers without provisioning, managing, or scaling the underlying EC2 server hosts.

### 4. How do ECS Clusters, Task Definitions, Tasks, and Services relate?
- **Task Definition**: A JSON blueprint that describes your container config (e.g. CPU, memory, ports, images).
- **Task**: A running instance of a Task Definition.
- **Service**: Manages the scaling and lifecycle of Tasks, ensuring the desired count of tasks are running and replacing failed ones.
- **Cluster**: A logical grouping of Services and Tasks.

### 5. Why is using the `latest` image tag in production discouraged?
The `latest` tag is mutable, meaning it can point to different container builds over time. If a Fargate task crashes and ECS pulls the `latest` image to replace it, it might pull a newer, untested build, causing configuration drift. Always tag production builds with unique versions (e.g. `v1.2.3` or git commit hashes).

### 6. How does an ALB route traffic to Fargate tasks in "awsvpc" mode?
In Fargate, tasks use the **`awsvpc` network mode**, giving each running task its own private Elastic Network Interface (ENI) and private IP address.
To route traffic, the ALB Target Group must use the **`ip` target type** (rather than `instance` type), registering and routing HTTP traffic directly to the tasks' private IP addresses.
