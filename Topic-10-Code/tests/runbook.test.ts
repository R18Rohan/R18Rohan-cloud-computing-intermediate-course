import { RunbookAuditor } from '../src/runbookAuditor';

describe('DevOps Capstone Part 2 Playbook & ADR Tests', () => {
  let auditor: RunbookAuditor;

  beforeEach(() => {
    auditor = new RunbookAuditor();
  });

  describe('Runbook template audits', () => {
    test('should pass validation on correct runbook formatting', () => {
      const content = `
        # Runbook
        ## Escalation Path
        Contact DevOps lead on PagerDuty.
        ## Trigger Rule
        Alert when disk usage exceeds 90%.
        ## Remediation Protocol
        1. Run cleanup logs script.
      `;
      const report = auditor.auditRunbook(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag configurations missing escalation rules', () => {
      const content = `
        # Runbook
        ## Trigger Rule
        Alert when CPU > 95%.
        ## Remediation
        1. Restart server.
      `; // Missing escalation
      const report = auditor.auditRunbook(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must specify 'Escalation Pathways'");
    });
  });

  describe('Architecture Decision Record (ADR) audits', () => {
    test('should pass validation on correct ADR specs', () => {
      const content = `
        # ADR 1: Choose PostgreSQL for DB
        Status: Accepted
        ## Context
        We need relational database consistency models.
        ## Decision
        Deploy PostgreSQL database cluster using RDS.
      `;
      const report = auditor.auditArchitectureADR(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag ADRs missing decision status parameters', () => {
      const content = `
        # ADR 1: Choose PostgreSQL
        ## Context
        We need databases.
        ## Decision
        Use PostgreSQL.
      `; // Missing Status:
      const report = auditor.auditArchitectureADR(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must specify the decision status");
    });
  });
});
