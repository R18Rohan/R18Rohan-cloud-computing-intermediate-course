// AWS DevOps & CI/CD Pipeline Configuration Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class PipelineAuditor {
  // 1. Audit AWS CodeBuild buildspec files for compilation and tests stages
  auditBuildspec(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('build:')) {
      violations.push("Configuration Error: buildspec.yml must declare a 'build' phase task.");
    }
    if (!content.includes('post_build:')) {
      violations.push("Best Practice Violation: buildspec.yml should declare a 'post_build' phase to verify artifacts.");
    }
    // Shift-Left test execution assertion
    if (!/\btest\b/.test(content)) {
      violations.push("Shift-Left Security Violation: buildspec.yml must run tests ('test') before generating artifacts.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit AWS CodeDeploy appspec files for verification scripts
  auditAppspec(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('hooks:')) {
      violations.push("Configuration Error: appspec.yml must declare lifecycle 'hooks'.");
    }
    if (!content.includes('ValidateService:')) {
      violations.push("Reliability Warning: appspec.yml must define a 'ValidateService' lifecycle hook to confirm application health.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit GitHub Actions workflows for OIDC permissions configuration
  auditGithubWorkflow(content: string): AuditReport {
    const violations: string[] = [];

    // OIDC Rule: If using configure-aws-credentials, permissions must grant id-token: write
    if (content.includes('configure-aws-credentials') || content.includes('role-to-assume')) {
      const hasIdTokenWrite = content.includes('id-token: write');
      if (!hasIdTokenWrite) {
        violations.push("Security Violation: GitHub Actions OIDC logins require 'id-token: write' workflow permissions.");
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
