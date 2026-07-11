import { CapstoneAuditor } from '../src/capstoneAuditor';

describe('DevOps Capstone Part 1 Auditor Tests', () => {
  let auditor: CapstoneAuditor;

  beforeEach(() => {
    auditor = new CapstoneAuditor();
  });

  describe('Kubernetes template scraper audits', () => {
    test('should pass validation on correct scrape settings', () => {
      const content = `
        metadata:
          annotations:
            prometheus.io/scrape: "true"
            prometheus.io/port: "8080"
      `;
      const report = auditor.auditKubernetesManifest(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag configurations missing metrics scrapers annotations', () => {
      const content = `
        metadata:
          annotations:
            prometheus.io/port: "8080"
      `; // Missing scrape: "true"
      const report = auditor.auditKubernetesManifest(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("scrape' annotation set to 'true'");
    });
  });

  describe('ArgoCD sync configuration audits', () => {
    test('should pass validation on correct GitOps app specs', () => {
      const content = `
        spec:
          destination:
            namespace: orion-prod
          syncPolicy:
            automated:
              selfHeal: true
      `;
      const report = auditor.auditArgoCDApplication(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag app configs missing self-heal sync properties', () => {
      const content = `
        spec:
          destination:
            namespace: orion-prod
      `;
      const report = auditor.auditArgoCDApplication(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("automated sync policies with selfHeal enabled");
    });
  });

  describe('CI pipelines security scanning checks', () => {
    test('should pass on workflows including SAST and Trivy triggers', () => {
      const content = `
        steps:
          - name: Run Semgrep scan
            run: semgrep ci
          - name: Audit Docker images
            run: trivy image app:latest
      `;
      const report = auditor.auditCIPipelineSecurity(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag workflows omitting SAST scans commands', () => {
      const content = `
        steps:
          - name: Audit Docker images
            run: trivy image app:latest
      `;
      const report = auditor.auditCIPipelineSecurity(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("run SAST vulnerability scanners");
    });
  });
});
