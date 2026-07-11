// AWS Cost Optimization & Well-Architected Framework Auditor
import { CloudResource, isOverprovisioned } from './costMocks';

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class CostAuditor {
  auditResource(resource: CloudResource): AuditReport {
    const violations: string[] = [];

    // 1. Audit Cost Allocation tags (Required for tracking dashboard expenses)
    const requiredTags = ["Environment", "Project", "Owner"];
    for (const tag of requiredTags) {
      if (!resource.tags || !resource.tags[tag] || resource.tags[tag].trim() === "") {
        violations.push(`Tagging Policy Violation: Resource '${resource.id}' is missing the required Cost Allocation tag '${tag}'.`);
      }
    }

    // 2. Audit Resource sizing settings (AWS Compute Optimizer Simulator checks)
    if (isOverprovisioned(resource.instanceType)) {
      violations.push(`Sizing Recommendation: Resource '${resource.id}' is provisioned on an oversized instance type '${resource.instanceType}'. Downsize to optimize budget spend.`);
    }

    // 3. Audit Spot Instances settings
    if (resource.spotEnabled) {
      if (resource.spotBidPrice === undefined || resource.spotBidPrice <= 0) {
        violations.push(`Spot Configuration Error: Resource '${resource.id}' enables spot pricing but specifies an invalid spot bid price ($${resource.spotBidPrice || 0}).`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
