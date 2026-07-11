import { IacAuditor } from '../src/iacAuditor';

describe('DevOps IaC at Scale Auditor Tests', () => {
  let auditor: IacAuditor;

  beforeEach(() => {
    auditor = new IacAuditor();
  });

  describe('Terraform remote state backend audits', () => {
    test('should pass validation on correct backend settings', () => {
      const content = `
        terraform {
          backend "s3" {
            bucket         = "orion-state"
            key            = "path/to/my/key"
            region         = "us-east-1"
            dynamodb_table = "lock-table"
            encrypt        = true
          }
        }
      `;
      const report = auditor.auditTerraformBackend(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag backend configurations missing state encryption keys', () => {
      const content = `
        terraform {
          backend "s3" {
            bucket         = "orion-state"
            dynamodb_table = "lock-table"
          }
        }
      `; // Missing encrypt = true
      const report = auditor.auditTerraformBackend(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("state encryption ('encrypt = true') must be enabled");
    });

    test('should flag backend configurations missing state locking tables', () => {
      const content = `
        terraform {
          backend "s3" {
            bucket  = "orion-state"
            encrypt = true
          }
        }
      `; // Missing dynamodb_table
      const report = auditor.auditTerraformBackend(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("requires specifying a 'dynamodb_table'");
    });

    test('should flag backend configurations lacking S3 backend type declarations', () => {
      const content = `
        terraform {
          backend "local" {}
        }
      `; // Local instead of S3
      const report = auditor.auditTerraformBackend(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must use the 's3' type");
    });
  });
});
