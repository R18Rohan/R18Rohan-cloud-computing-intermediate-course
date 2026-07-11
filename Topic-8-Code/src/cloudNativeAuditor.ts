// AWS Orion LMS Cloud-Native Configurations Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class CloudNativeAuditor {
  // 1. Audit AWS CodeBuild buildspec configurations
  auditBuildspec(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes("version: 0.2") && !content.includes("version: '0.2'")) {
      violations.push("Configuration Error: Buildspec schema version must be 0.2.");
    }

    if (!content.includes("phases:")) {
      violations.push("Configuration Error: Buildspec must define a 'phases' block.");
      return { valid: false, violations };
    }

    if (!content.includes("pre_build:") || !content.includes("build:") || !content.includes("post_build:")) {
      violations.push("Configuration Error: Buildspec phases must include 'pre_build', 'build', and 'post_build' sections.");
    }

    // Shift-left: Ensure build pipeline executes testing suites
    const hasTests = /\bnpm\s+run\s+test\b|\bjest\b|\bnpm\s+test\b/.test(content);
    if (!hasTests) {
      violations.push("Shift-Left Security Violation: Buildspec command scripts must trigger unit or integration tests (e.g. 'npm test').");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit EKS IAM Roles for Service Accounts (IRSA) trust policies
  auditEksIamRole(policyJson: string): AuditReport {
    const violations: string[] = [];

    try {
      const policy = JSON.parse(policyJson);
      const statements = policy.Statement || [];

      const hasOidcTrust = statements.some((stmt: any) => {
        const action = stmt.Action || [];
        const actionsList = Array.isArray(action) ? action : [action];
        return actionsList.includes("sts:AssumeRoleWithWebIdentity") && 
               stmt.Effect === "Allow" &&
               stmt.Principal && stmt.Principal.Federated;
      });

      if (!hasOidcTrust) {
        violations.push("IAM Security Violation: EKS Service Account IAM Trust Policy must specify OIDC Federation trust action ('sts:AssumeRoleWithWebIdentity').");
      }

    } catch {
      violations.push("Syntax Error: IAM Policy must be a valid JSON string.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
