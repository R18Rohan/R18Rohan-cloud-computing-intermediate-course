// AWS Advanced Cloud Security Configurations Auditor

export interface SecretRotationConfig {
  automaticallyAfterDays: number;
}

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class SecurityAuditor {
  // 1. Audit AWS KMS key configurations for key rotation compliance
  auditKmsKey(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('enable_key_rotation = true')) {
      violations.push("Security Violation: KMS Customer Managed Keys must have automatic key rotation enabled ('enable_key_rotation = true').");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit AWS Secrets Manager secrets configuration policies
  auditSecretsManager(content: string, rotationDays: number): AuditReport {
    const violations: string[] = [];

    if (!content.includes('aws_secretsmanager_secret_rotation')) {
      violations.push("Security Warning: Secrets Manager resources should define automatic secret rotation rules.");
    }

    // AWS Best Practice: Secret rotations should occur every 90 days or less
    if (rotationDays > 90) {
      violations.push(`Compliance Violation: Secrets rotation schedule (${rotationDays} days) exceeds the recommended limit of 90 days.`);
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit AWS WAF definitions for SQL injection blocks
  auditWafRules(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('sqli_match_statement')) {
      violations.push("Security Warning: WAF Web ACL configurations must declare 'sqli_match_statement' rules to protect endpoints from SQL injection attacks.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
