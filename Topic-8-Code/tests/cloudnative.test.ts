import { CloudNativeAuditor } from '../src/cloudNativeAuditor';

describe('Orion LMS Cloud-Native AWS DevOps Auditor Tests', () => {
  let auditor: CloudNativeAuditor;

  beforeEach(() => {
    auditor = new CloudNativeAuditor();
  });

  describe('AWS CodeBuild buildspec audits', () => {
    test('should pass validation on correct buildspec schemas triggering tests', () => {
      const content = `
        version: 0.2
        phases:
          pre_build:
            commands:
              - npm install
          build:
            commands:
              - npm run test
              - docker build -t app .
          post_build:
            commands:
              - docker push app
      `;
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag buildspecs missing testing phases', () => {
      const content = `
        version: 0.2
        phases:
          pre_build:
            commands:
              - echo no tests here
          build:
            commands:
              - docker build -t app .
          post_build:
            commands:
              - docker push app
      `; // Missing npm test or jest commands
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must trigger unit or integration tests");
    });

    test('should flag buildspecs missing phases sections', () => {
      const content = `
        version: 0.2
      `; // Missing phases section
      const report = auditor.auditBuildspec(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must define a 'phases' block");
    });
  });

  describe('EKS Service Account (IRSA) trust policy audits', () => {
    test('should pass verification on valid OIDC trust policies', () => {
      const policy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "arn:aws:iam::123456789012:oidc-provider/oidc.eks.region.amazonaws.com/id/EXAMPLE"
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "oidc.eks.region.amazonaws.com/id/EXAMPLE:sub": "system:serviceaccount:default:my-serviceaccount"
              }
            }
          }
        ]
      });
      const report = auditor.auditEksIamRole(policy);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag trust policies missing OIDC web identity actions', () => {
      const policy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: "arn:aws:iam::123456789012:root"
            },
            Action: "sts:AssumeRole"
          }
        ]
      }); // Missing AssumeRoleWithWebIdentity
      const report = auditor.auditEksIamRole(policy);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must specify OIDC Federation trust action");
    });
  });
});
