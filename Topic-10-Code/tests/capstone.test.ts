import { CapstoneAuditor } from '../src/capstoneAuditor';

describe('DevOps Capstone Part 2 Auditor Tests', () => {
  let auditor: CapstoneAuditor;

  beforeEach(() => {
    auditor = new CapstoneAuditor();
  });

  describe('Cost Report Sizing scans', () => {
    test('should pass validation on correct pricing report', () => {
      const content = `
        # Cost Report
        - Fargate CPU instances
        - RDS multi-AZ databases
        - ALB load balancing
        - S3 static assets
        
        ## Cost Optimization Plan
        Use savings plans for compute resource optimization.
      `;
      const report = auditor.auditCostReport(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag reports missing S3 cost estimates', () => {
      const content = `
        # Cost Report
        - Fargate CPU instances
        - RDS multi-AZ databases
        - ALB load balancing
        
        ## Cost Optimization Plan
        Use savings plans for compute resource optimization.
      `;
      const report = auditor.auditCostReport(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("calculate S3 storage");
    });

    test('should flag reports missing cost optimization plans', () => {
      const content = `
        # Cost Report
        - Fargate CPU instances
        - RDS multi-AZ databases
        - ALB load balancing
        - S3 static assets
      `;
      const report = auditor.auditCostReport(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("propose a cost optimization plan");
    });
  });

  describe('Well-Architected Pillar checks', () => {
    test('should pass validation on complete reviews', () => {
      const content = `
        1. Reliability: Multi-AZ backups are enabled.
        2. Security: IAM role parameters are defined.
        3. Cost Optimization: Instance sizing is monitored.
        4. Performance Efficiency: Viewport routing metrics.
        5. Operational Excellence: Alert configurations are active.
      `;
      const report = auditor.auditWellArchitectedReview(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag reviews missing security pillars', () => {
      const content = `
        1. Reliability: Multi-AZ backups are enabled.
        3. Cost Optimization: Instance sizing is monitored.
        4. Performance Efficiency: Viewport routing metrics.
        5. Operational Excellence: Alert configurations are active.
      `;
      const report = auditor.auditWellArchitectedReview(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("missing the security architectural pillar");
    });
  });

  describe('Video Demo manifest checks', () => {
    test('should pass on manifests within duration limits', () => {
      const manifest = {
        videoDurationSeconds: 420,
        stepsExposed: ['aws-console-check', 'app-walkthrough']
      };
      const report = auditor.auditDemoManifest(manifest);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag videos exceeding the 8-minute limit', () => {
      const manifest = {
        videoDurationSeconds: 500, // 8m 20s
        stepsExposed: ['aws-console-check', 'app-walkthrough']
      };
      const report = auditor.auditDemoManifest(manifest);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("video duration exceeds the 8-minute limit");
    });

    test('should flag videos missing console verification steps', () => {
      const manifest = {
        videoDurationSeconds: 300,
        stepsExposed: ['app-walkthrough']
      };
      const report = auditor.auditDemoManifest(manifest);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must show console verification walkthrough");
    });
  });
});
