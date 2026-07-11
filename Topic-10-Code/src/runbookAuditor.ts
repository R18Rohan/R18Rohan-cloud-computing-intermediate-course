// DevOps Capstone Part 2 Playbook & Architecture Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class RunbookAuditor {
  // 1. Audit Incident Runbook document format
  auditRunbook(content: string): AuditReport {
    const violations: string[] = [];

    const hasEscalation = /Escalation/i.test(content);
    if (!hasEscalation) {
      violations.push("Operational Violation: Runbook must specify 'Escalation Pathways' or escalation contacts.");
    }

    const hasTriggerRule = /Trigger/i.test(content);
    if (!hasTriggerRule) {
      violations.push("Operational Violation: Runbook must define alert 'Trigger' rules or trigger conditions.");
    }

    const hasRemediation = /Remediation/i.test(content) || /Protocol/i.test(content);
    if (!hasRemediation) {
      violations.push("Operational Violation: Runbook must define step-by-step remediation procedures.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit Architecture Decision Records (ADRs)
  auditArchitectureADR(content: string): AuditReport {
    const violations: string[] = [];

    const hasStatus = /Status:/i.test(content) || /"Status"/i.test(content);
    if (!hasStatus) {
      violations.push("Architecture Violation: ADR must specify the decision status (e.g. Status: Accepted).");
    }

    const hasContext = /Context/i.test(content);
    if (!hasContext) {
      violations.push("Architecture Violation: ADR must document context and problem statement details.");
    }

    const hasDecision = /Decision/i.test(content);
    if (!hasDecision) {
      violations.push("Architecture Violation: ADR must specify the technical choice and decision details.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
