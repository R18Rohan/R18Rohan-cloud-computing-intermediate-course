// DevOps IaC at Scale Configurations Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class IacAuditor {
  // 1. Audit Terraform backend TF file parameters
  auditTerraformBackend(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('backend "s3"')) {
      violations.push("Configuration Error: Terraform remote backend must use the 's3' type.");
      return { valid: false, violations };
    }

    if (!/bucket\s*=/.test(content)) {
      violations.push("Configuration Error: S3 backend must specify a state 'bucket' value.");
    }

    if (!/encrypt\s*=\s*true/.test(content)) {
      violations.push("Security Violation: S3 backend state encryption ('encrypt = true') must be enabled to protect configuration values.");
    }

    if (!/dynamodb_table\s*=/.test(content)) {
      violations.push("Security/Concurrency Violation: Remote state locking requires specifying a 'dynamodb_table' to prevent concurrent apply overlaps.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
