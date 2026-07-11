// Advanced Docker & Container Security Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class DockerSecurityAuditor {
  // 1. Audit Dockerfiles for security hardening and minimal footprints
  auditDockerfile(content: string): AuditReport {
    const violations: string[] = [];

    // Check for multi-stage build usage
    const fromStagesCount = (content.match(/FROM /g) || []).length;
    if (fromStagesCount < 2) {
      violations.push("Optimization Violation: Dockerfile should utilize multi-stage builds to minimize runtime footprints.");
    }

    // Check for non-root running users
    if (!content.includes('USER ')) {
      violations.push("Security Violation: Dockerfile must declare a non-root 'USER' statement to drop system execution privileges.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit Docker Compose configurations for container run boundaries
  auditDockerCompose(content: string): AuditReport {
    const violations: string[] = [];

    // Check for read-only root filesystems
    if (!content.includes('read_only: true')) {
      violations.push("Security Warning: Containers should run with read-only filesystems ('read_only: true') to prevent script injection.");
    }

    // Check for custom bridge networks
    if (!content.includes('driver: bridge') && !content.includes('networks:')) {
      violations.push("Best Practice Violation: Docker Compose configurations should declare custom bridge networks to isolate application tiers.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
