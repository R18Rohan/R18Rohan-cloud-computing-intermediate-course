// DevOps Capstone Configurations Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class CapstoneAuditor {
  // 1. Audit Kubernetes manifest file scrape annotations
  auditKubernetesManifest(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('prometheus.io/scrape: "true"') && !content.includes('prometheus.io/scrape: \'true\'')) {
      violations.push("Observability Violation: Pod template must define 'prometheus.io/scrape' annotation set to 'true'.");
    }

    if (!content.includes("prometheus.io/port:")) {
      violations.push("Observability Violation: Pod template must specify target scrape 'prometheus.io/port' annotation.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit ArgoCD Application properties
  auditArgoCDApplication(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes("automated:") && !content.includes("selfHeal: true")) {
      violations.push("GitOps Violation: ArgoCD application should enable automated sync policies with selfHeal enabled.");
    }

    if (!content.includes("destination:") && !content.includes("namespace:")) {
      violations.push("GitOps Violation: ArgoCD configuration must specify target destination cluster namespace.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit CI Pipeline Security scans triggers
  auditCIPipelineSecurity(content: string): AuditReport {
    const violations: string[] = [];

    const hasSast = /semgrep|sonarqube|sast/i.test(content);
    if (!hasSast) {
      violations.push("Security Compliance Error: CI workflow must run SAST vulnerability scanners (e.g. semgrep).");
    }

    const hasImageScan = /trivy|snyk|docker\s+scan/i.test(content);
    if (!hasImageScan) {
      violations.push("Security Compliance Error: CI workflow must run container image scanners (e.g. trivy).");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
