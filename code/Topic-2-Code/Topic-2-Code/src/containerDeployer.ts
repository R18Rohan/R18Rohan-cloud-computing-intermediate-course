// AWS ECS Fargate & Container Deployment Auditor

export interface TaskDefinitionConfig {
  cpu: number;         // in CPU units (e.g. 256, 512, 1024)
  memory: number;      // in MB (e.g. 512, 1024, 2048)
  containerPort: number;
  imageTag: string;
}

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class ContainerDeployer {
  // Validate Task configurations against AWS Fargate constraints
  auditConfiguration(config: TaskDefinitionConfig): AuditReport {
    const violations: string[] = [];

    // 1. Check Fargate CPU validity
    const validCPUs = [256, 512, 1024, 2048, 4096];
    if (!validCPUs.includes(config.cpu)) {
      violations.push(`Invalid CPU value: ${config.cpu}. Fargate supports 256, 512, 1024, 2048, or 4096.`);
    }

    // 2. Check Fargate CPU and Memory ratios
    if (config.cpu === 256) {
      if (config.memory < 512 || config.memory > 2048) {
        violations.push(`Invalid memory for 256 CPU: ${config.memory}MB. Must be between 512MB and 2048MB.`);
      }
    } else if (config.cpu === 512) {
      if (config.memory < 1024 || config.memory > 4096) {
        violations.push(`Invalid memory for 512 CPU: ${config.memory}MB. Must be between 1024MB and 4096MB.`);
      }
    } else if (config.cpu === 1024) {
      if (config.memory < 2048 || config.memory > 8192) {
        violations.push(`Invalid memory for 1024 CPU: ${config.memory}MB. Must be between 2048MB and 8192MB.`);
      }
    }

    // 3. Port check (must expose internal server ports like 3000 to match Dockerfile EXPOSE)
    if (config.containerPort !== 3000) {
      violations.push(`Exposed containerPort ${config.containerPort} does not match Node.js default service port (3000).`);
    }

    // 4. Image tags check (avoid mutable 'latest' tags in production deployments)
    if (config.imageTag === 'latest') {
      violations.push("Risk: Using 'latest' image tag is not recommended for stable production releases.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
