export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export interface DemoManifest {
  videoDurationSeconds: number;
  stepsExposed: string[];
}

export class CapstoneAuditor {
  // 1. Audit Cost Report Markdown content
  public auditCostReport(content: string): AuditReport {
    const violations: string[] = [];

    const resources = ["Fargate", "RDS", "ALB", "S3"];
    for (const r of resources) {
      const regex = new RegExp(r, "i");
      if (!regex.test(content)) {
        violations.push(`Cost Compliance Error: Cost report must calculate ${r} storage/compute estimates.`);
      }
    }

    if (!content.toLowerCase().includes("cost optimization plan")) {
      violations.push("Cost Compliance Error: Cost report must propose a cost optimization plan.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit Well-Architected Self-Audit structure
  public auditWellArchitectedReview(content: string): AuditReport {
    const violations: string[] = [];

    const pillars = [
      "reliability",
      "security",
      "cost optimization",
      "performance efficiency",
      "operational excellence"
    ];

    for (const p of pillars) {
      const regex = new RegExp(p, "i");
      if (!regex.test(content)) {
        violations.push(`Architecture Compliance Error: Self-audit is missing the ${p} architectural pillar.`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit Demo Manifest parameters
  public auditDemoManifest(manifest: DemoManifest): AuditReport {
    const violations: string[] = [];

    // Max limit is 8 minutes (480 seconds)
    if (manifest.videoDurationSeconds > 480) {
      violations.push("Demo Compliance Error: Demo video duration exceeds the 8-minute limit.");
    }

    if (!manifest.stepsExposed.includes("aws-console-check")) {
      violations.push("Demo Compliance Error: Demo must show console verification walkthrough.");
    }

    if (!manifest.stepsExposed.includes("app-walkthrough")) {
      violations.push("Demo Compliance Error: Demo must show application UI walkthrough.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
