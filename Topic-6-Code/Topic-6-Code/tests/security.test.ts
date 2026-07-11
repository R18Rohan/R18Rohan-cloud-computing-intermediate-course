import { SecurityAuditor } from '../src/securityAuditor';

describe('AWS Advanced Cloud Security Auditor Tests', () => {
  let auditor: SecurityAuditor;

  beforeEach(() => {
    auditor = new SecurityAuditor();
  });

  describe('AWS KMS Key Rotations checks', () => {
    test('should pass verification on customer managed keys with rotation enabled', () => {
      const content = `
        resource "aws_kms_key" "main" {
          enable_key_rotation = true
        }
      `;
      const report = auditor.auditKmsKey(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag keys missing automatic rotation configurations', () => {
      const content = `
        resource "aws_kms_key" "main" {
          enable_key_rotation = false
        }
      `;
      const report = auditor.auditKmsKey(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("KMS Customer Managed Keys must have automatic key rotation enabled");
    });
  });

  describe('AWS Secrets Manager Rotations checks', () => {
    test('should pass on secrets scheduled to rotate within 90 days', () => {
      const content = `
        resource "aws_secretsmanager_secret_rotation" "db" {
          automatically_after_days = 30
        }
      `;
      const report = auditor.auditSecretsManager(content, 30);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag secrets scheduled to rotate past 90 days', () => {
      const content = `
        resource "aws_secretsmanager_secret_rotation" "db" {
          automatically_after_days = 120
        }
      `;
      const report = auditor.auditSecretsManager(content, 120);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("rotation schedule (120 days) exceeds the recommended limit");
    });

    test('should warn on configuration contents missing secret rotation rules', () => {
      const content = `
        resource "aws_secretsmanager_secret" "db" {
          name = "db-pass"
        }
      `;
      const report = auditor.auditSecretsManager(content, 30); // Missing rotation resources

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("Secrets Manager resources should define automatic secret rotation");
    });
  });

  describe('AWS WAF Rules checks', () => {
    test('should pass on Web ACLs protecting against SQL Injection', () => {
      const content = `
        rule {
          name = "SQLiRule"
          statement {
            sqli_match_statement {}
          }
        }
      `;
      const report = auditor.auditWafRules(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should warn on Web ACL configurations missing SQL injection protection rules', () => {
      const content = `
        rule {
          name = "DefaultRule"
          statement {
            ip_set_reference_statement {}
          }
        }
      `; // Missing sqli_match_statement
      const report = auditor.auditWafRules(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must declare 'sqli_match_statement' rules");
    });
  });
});
